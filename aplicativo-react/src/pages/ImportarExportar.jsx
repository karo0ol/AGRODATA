// ImportarExportar: importar el Excel del RTC y exportar sus datos (M7).
//   IMPORTAR (decisión 10.3, opción B: reimportar sin duplicar)
//     - Se sube el Excel de formato fijo (.xlsx o .csv).
//     - Llaves: NIT normalizado para clientes, referencia para productos y
//       NIT + referencia + presentación + semana + fecha para ventas.
//     - Antes de confirmar hay vista previa: nuevas, omitidas y con error.
//     - Lo que ya existe en la app NO se sobrescribe.
//     - Requiere internet (decisión 10.1).
//   EXPORTAR
//     - Clientes, ventas, productos, visitas o compromisos, en Excel o CSV.
//
// IMPORTANTE: cambia COLUMNAS por los encabezados reales del Excel del RTC.
//
// COMPONENTE: <VistaPreviaImportacion resumen filas />
//
// useConexion devuelve { enLinea: true | false }.

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { useConexion } from '../hooks/useConexion.js';
import { clientes } from '../data/clientes.js';
import { productos } from '../data/productos.js';
import { useDatos } from '../hooks/useDatos.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import VistaPreviaImportacion from '../components/importacion/VistaPreviaImportacion.jsx';
import AvisoSinConexion from '../components/conexion/AvisoSinConexion.jsx';

// ---------- MAPEO DE COLUMNAS (formato fijo del Excel del RTC) ----------
// A la izquierda el nombre interno; a la derecha el encabezado EXACTO del Excel.
const COLUMNAS = {
  numero: 'NUMERO',
  cliente: 'CLIENTE',
  nit: 'NIT',
  finca: 'FINCA',
  referencia: 'REFERENCIA',
  producto: 'PRODUCTO',
  presentacion: 'PRESENTACION',
  semana: 'SEMANA',
  fecha: 'FECHA',
  cantidad: 'CANTIDAD',
  valorUnitario: 'V/r UNITARIO',
  valorTotal: 'VALOR',
};
const OBLIGATORIAS = ['nit', 'referencia', 'fecha', 'cantidad'];

// ---------- FUNCIONES AUXILIARES ----------

// NIT sin puntos, guiones, espacios ni dígito de verificación (lo que va después del guion)
const normalizarNit = (valor) => String(valor ?? '').split('-')[0].replace(/\D/g, '');

const texto = (valor) => String(valor ?? '').trim();

// Convierte "1.234,50", "$1500" o un número en Number; devuelve null si no hay número
function aNumero(valor) {
  if (typeof valor === 'number') return valor;
  let t = String(valor ?? '').replace(/[^0-9,.-]/g, '');
  if (t === '') return null;
  if (t.includes(',') && t.includes('.')) t = t.replace(/\./g, '').replace(',', '.');
  else if (t.includes(',')) t = t.replace(',', '.');
  const n = Number(t);
  return Number.isNaN(n) ? null : n;
}

// Excel guarda las fechas como número de serie; también aceptamos AAAA-MM-DD y DD/MM/AAAA
function aFecha(valor) {
  if (typeof valor === 'number') {
    const d = XLSX.SSF.parse_date_code(valor);
    if (!d) return '';
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const t = texto(valor);
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : '';
}

// Llave que identifica una venta (decisión 10.3)
const claveVenta = (nit, referencia, presentacion, semana, fecha) =>
  [nit, referencia, presentacion, semana, fecha].map((x) => texto(x).toUpperCase()).join('|');

// Lee el archivo y devuelve sus filas como objetos { ENCABEZADO: valor }
async function leerArchivo(archivo) {
  let libro;
  if (archivo.name.toLowerCase().endsWith('.csv')) {
    libro = XLSX.read(await archivo.text(), { type: 'string' });
  } else {
    libro = XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
  }
  const hoja = libro.Sheets[libro.SheetNames[0]];
  return XLSX.utils.sheet_to_json(hoja, { defval: '' });
}

// Compara el archivo con lo que ya existe y clasifica cada fila
function analizar(filas, ventas) {
  const nitsConocidos = new Set(clientes.map((c) => normalizarNit(c.nit)).filter(Boolean));
  const refsConocidas = new Set(productos.map((p) => texto(p.referencia).toUpperCase()).filter(Boolean));

  const clavesExistentes = new Set(
    ventas.map((v) => {
      const cliente = clientes.find((c) => c.id === v.clienteId);
      const producto = productos.find((p) => String(p.id) === String(v.productoId));
      return claveVenta(normalizarNit(cliente?.nit), producto?.referencia, v.presentacion, v.semana, v.fecha);
    }),
  );

  const vistos = new Set();
  const clientesNuevos = new Map();
  const productosNuevos = new Map();
  const ventasNuevas = [];
  const filasVista = [];
  let nuevas = 0, omitidas = 0, errores = 0;

  filas.forEach((fila, i) => {
    const nit = normalizarNit(fila[COLUMNAS.nit]);
    const referencia = texto(fila[COLUMNAS.referencia]).toUpperCase();
    const nombreCliente = texto(fila[COLUMNAS.cliente]);
    const nombreProducto = texto(fila[COLUMNAS.producto]);
    const presentacion = texto(fila[COLUMNAS.presentacion]);
    const semana = texto(fila[COLUMNAS.semana]);
    const fecha = aFecha(fila[COLUMNAS.fecha]);
    const cantidad = aNumero(fila[COLUMNAS.cantidad]);

    const base = {
      fila: i + 2,   // fila real en el Excel (la 1 son los encabezados)
      cliente: nombreCliente || nit || '—',
      producto: nombreProducto || referencia || '—',
      fecha,
    };

    // 1. Validaciones
    const problemas = [];
    if (!nit) problemas.push('Falta el NIT');
    if (!referencia) problemas.push('Falta la referencia');
    if (!fecha) problemas.push('Fecha no válida');
    if (cantidad === null || cantidad <= 0) problemas.push('Cantidad no válida');
    if (problemas.length > 0) {
      errores += 1;
      filasVista.push({ ...base, estado: 'Con error', motivo: problemas.join(', ') });
      return;
    }

    // 2. ¿La venta ya existe o está repetida en el mismo archivo?
    const clave = claveVenta(nit, referencia, presentacion, semana, fecha);
    if (clavesExistentes.has(clave) || vistos.has(clave)) {
      omitidas += 1;
      filasVista.push({
        ...base,
        estado: 'Omitida',
        motivo: clavesExistentes.has(clave) ? 'La venta ya está registrada' : 'Repetida en el archivo',
      });
      return;
    }
    vistos.add(clave);

    // 3. Cliente y producto nuevos (los que ya existen NO se modifican)
    // La finca todavía no es parte de la llave: falta confirmar con el RTC si un NIT puede tener varias.
    if (!nitsConocidos.has(nit) && !clientesNuevos.has(nit)) {
      clientesNuevos.set(nit, {
        id: 'C' + Date.now() + '-' + nit,
        nombre: nombreCliente || 'Sin nombre',
        nit,
        finca: texto(fila[COLUMNAS.finca]),
        numeroExcel: texto(fila[COLUMNAS.numero]),   // referencia del Excel; el id propio es el de la app
        estado: 'Activo',
        zona: '', departamento: '', municipio: '', tipo: '',
        documentos: { rut: false, camara: false, cedula: false, banco: false },
        ultimaVisita: '',
      });
    }
    if (!refsConocidas.has(referencia) && !productosNuevos.has(referencia)) {
      productosNuevos.set(referencia, {
        id: 'P' + Date.now() + '-' + referencia,
        nombre: nombreProducto || referencia,
        referencia,
        unidad: presentacion,
        precio: null,   // el precio del catálogo lo digita el RTC
      });
    }

    // 4. La venta guarda el valor que trae el Excel
    const precioUnitario = aNumero(fila[COLUMNAS.valorUnitario]);
    const valorExcel = aNumero(fila[COLUMNAS.valorTotal]);
    ventasNuevas.push({
      id: 'V' + Date.now() + '-' + i,
      nit, referencia,
      producto: nombreProducto || referencia,
      presentacion, semana, fecha, cantidad, precioUnitario,
      valorTotal: valorExcel ?? (precioUnitario == null ? null : cantidad * precioUnitario),
    });

    nuevas += 1;
    filasVista.push({ ...base, estado: 'Nueva', motivo: '' });
  });

  return {
    resumen: {
      nuevas, omitidas, errores,
      clientesNuevos: clientesNuevos.size,
      productosNuevos: productosNuevos.size,
    },
    filas: filasVista,
    nuevos: {
      clientes: [...clientesNuevos.values()],
      productos: [...productosNuevos.values()],
      ventas: ventasNuevas,
    },
  };
}

// ---------- EXPORTAR ----------
const nombreDe = (lista, id) => lista.find((x) => String(x.id) === String(id))?.nombre ?? '';

const CONJUNTOS = {
  clientes: {
    texto: 'Clientes',
    filas: () => clientes.map((c) => ({
      NIT: c.nit ?? '', Nombre: c.nombre, Departamento: c.departamento ?? '', Municipio: c.municipio ?? '',
      Zona: c.zona ?? '', Tipo: c.tipo ?? '', Estado: c.estado ?? '', 'Última visita': c.ultimaVisita ?? '',
    })),
  },
  ventas: {
    texto: 'Ventas',
    filas: (ventas) => ventas.map((v) => ({
      Fecha: v.fecha, Cliente: nombreDe(clientes, v.clienteId), Producto: v.producto ?? '',
      Cantidad: v.cantidad ?? '', 'Precio unitario': v.precioUnitario ?? '', 'Valor total': v.valorTotal ?? '',
    })),
  },
  productos: {
    texto: 'Productos',
    filas: () => productos.map((p) => ({
      Nombre: p.nombre, Referencia: p.referencia ?? '', Unidad: p.unidad ?? '', 'Precio unitario': p.precio ?? '',
    })),
  },
  visitas: {
    texto: 'Visitas',
    filas: () => visitas.map((v) => ({
      Fecha: v.fecha, Hora: v.hora ?? '', Cliente: nombreDe(clientes, v.clienteId),
      Objetivo: v.objetivo ?? '', Estado: v.estado ?? '', Resultado: v.resultado ?? '',
    })),
  },
  compromisos: {
    texto: 'Compromisos',
    filas: () => compromisos.map((c) => ({
      Fecha: c.fecha, Cliente: nombreDe(clientes, c.clienteId), Tipo: c.tipo ?? '',
      Descripción: c.descripcion ?? '', Estado: c.estado ?? '',
    })),
  },
};

export default function ImportarExportar() {
  const { ventas } = useDatos();
  const mostrarToast = useToast();
  const { enLinea } = useConexion();
  const hoy = new Date().toLocaleDateString('en-CA');
  const inputArchivo = useRef(null);

  // Importar
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [analisis, setAnalisis] = useState(null);
  const [error, setError] = useState('');
  const [leyendo, setLeyendo] = useState(false);
  const [resultado, setResultado] = useState('');

  // Exportar
  const [conjunto, setConjunto] = useState('clientes');
  const [formato, setFormato] = useState('xlsx');

  const limpiarImportacion = () => {
    setNombreArchivo('');
    setAnalisis(null);
    setError('');
    if (inputArchivo.current) inputArchivo.current.value = '';
  };

  // ----- IMPORTAR: paso 1, leer y analizar el archivo -----
  const elegirArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setResultado('');
    setError('');
    setAnalisis(null);
    setNombreArchivo(archivo.name);

    if (!/\.(xlsx|csv)$/i.test(archivo.name)) {
      setError('El archivo debe ser .xlsx o .csv.');
      return;
    }

    setLeyendo(true);
    try {
      const filas = await leerArchivo(archivo);
      if (filas.length === 0) {
        setError('El archivo no tiene filas para importar.');
        return;
      }
      // Revisamos que estén los encabezados obligatorios
      const faltantes = OBLIGATORIAS.map((k) => COLUMNAS[k]).filter((col) => !(col in filas[0]));
      if (faltantes.length > 0) {
        setError(`Faltan estas columnas en el archivo: ${faltantes.join(', ')}.`);
        return;
      }
      setAnalisis(analizar(filas, ventas));
    } catch {
      setError('No se pudo leer el archivo. Verifica que sea el Excel del RTC y que no esté dañado.');
    } finally {
      setLeyendo(false);
    }
  };

  // ----- IMPORTAR: paso 2, confirmar -----
  const confirmar = () => {
    const { resumen, nuevos } = analisis;
    // En el prototipo no hay servidor: se muestra en consola lo que se guardaría
    console.log('Importación confirmada:', nuevos);
    setResultado(
      `Importación completada: ${resumen.nuevas} venta(s) nuevas, ${resumen.clientesNuevos} cliente(s) nuevos ` +
      `y ${resumen.productosNuevos} producto(s) nuevos. Se omitieron ${resumen.omitidas} y ${resumen.errores} tenían error.`,
    );
    mostrarToast('Importación completada');
    limpiarImportacion();
  };

  // ----- EXPORTAR -----
  const exportar = () => {
    const { texto: nombre, filas } = CONJUNTOS[conjunto];
    const datos = filas(ventas);
    if (datos.length === 0) {
      mostrarToast('No hay datos para exportar');
      return;
    }

    const archivo = `agrodata-${conjunto}-${hoy}`;
    const hoja = XLSX.utils.json_to_sheet(datos);

    if (formato === 'xlsx') {
      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(libro, hoja, nombre);
      XLSX.writeFile(libro, archivo + '.xlsx');
    } else {
      // El \uFEFF al inicio hace que Excel muestre bien las tildes y la ñ
      const csv = '\uFEFF' + XLSX.utils.sheet_to_csv(hoja);
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = archivo + '.csv';
      enlace.click();
      URL.revokeObjectURL(url);
    }
    mostrarToast(`${nombre} exportados correctamente`);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Importar / Exportar</h2>
          <div className="subtitle">Trae tu Excel de clientes y descarga tus datos</div>
        </div>
      </div>

      {resultado && <div className="banner-warn" role="status">{resultado}</div>}

      <div className="import-grid">
        {/* ===== IMPORTAR ===== */}
        <div className="card">
          <h3>Importar Excel</h3>

          <AvisoSinConexion>
          La importación necesita internet. Vuelve a intentarlo cuando tengas conexión.
          </AvisoSinConexion>

          <div className="dropzone">
            <Upload />
            <div className="dz-title">Sube el Excel del RTC</div>
            <div className="dz-sub">Formato fijo · .xlsx o .csv</div>
            <input
              ref={inputArchivo}
              type="file"
              accept=".xlsx,.csv"
              onChange={elegirArchivo}
              disabled={!enLinea}
              hidden
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => inputArchivo.current?.click()}
              disabled={!enLinea || leyendo}
            >
              <FileSpreadsheet size={16} /> {leyendo ? 'Leyendo…' : 'Elegir archivo'}
            </button>
            {nombreArchivo && <p className="vc-meta" style={{ marginTop: 10 }}>{nombreArchivo}</p>}
          </div>

          {error && <div className="banner-warn" role="alert">{error}</div>}

          <p className="vc-meta">
            Puedes volver a importar el mismo Excel: las ventas, clientes y productos que ya existen no
            se duplican y lo que editaste en la app no se sobrescribe.
          </p>
        </div>

        {/* ===== EXPORTAR ===== */}
        <div className="card">
          <h3>Exportar datos</h3>

          <div className="fld">
            <label htmlFor="exp-conjunto">¿Qué quieres exportar?</label>
            <select id="exp-conjunto" value={conjunto} onChange={(e) => setConjunto(e.target.value)}>
              {Object.entries(CONJUNTOS).map(([clave, c]) => (
                <option key={clave} value={clave}>{c.texto}</option>
              ))}
            </select>
          </div>

          <div className="filetype-row" style={{ marginTop: 16 }}>
            {['xlsx', 'csv'].map((f) => (
              <button
                key={f}
                type="button"
                className={`filetype-btn ${formato === f ? 'active' : ''}`}
                aria-pressed={formato === f}
                onClick={() => setFormato(f)}
              >
                {f === 'xlsx' ? 'Excel (.xlsx)' : 'CSV (.csv)'}
              </button>
            ))}
          </div>

          <button type="button" className="btn btn-primary" onClick={exportar}>
            <Download size={16} /> Descargar
          </button>
        </div>
      </div>

      {/* ===== VISTA PREVIA (antes de confirmar) ===== */}
      {analisis && (
        <div className="card">
          <h3>Vista previa de la importación</h3>
          <VistaPreviaImportacion resumen={analisis.resumen} filas={analisis.filas} />
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={limpiarImportacion}>Cancelar</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmar}
              disabled={analisis.resumen.nuevas === 0}
            >
              Confirmar importación
            </button>
          </div>
        </div>
      )}
    </>
  );
}