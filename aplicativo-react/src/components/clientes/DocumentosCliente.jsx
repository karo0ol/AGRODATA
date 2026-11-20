// DocumentosCliente: documentos del cliente en la ficha (M2 · SYS-FR-014 a 019).
//   - RUT, Cámara de comercio, cédula y certificación bancaria.
//   - Cada uno se ve como "cargado" o "sin cargar".                         (SYS-FR-017)
//   - Subir, reemplazar o quitar. Subir documentos es OPCIONAL (decisión 9.8).
//   - VER y DESCARGAR cada documento cargado.                               (SYS-FR-019)
//   - Solo PDF, JPG o PNG, de máximo 5 MB.
//   - Necesita internet (decisión 10.1): sin conexión se ve la lista, pero no se
//     sube, quita, ve ni descarga ningún archivo.
//
// PROPS:
//   documentos:     { rut, camara, cedula, banco }
//                   cada valor es false (sin cargar), true (cargado de ejemplo),
//                   un TEXTO con el nombre del archivo, o un objeto { nombre, url, tipo }
//                   cuando el archivo se subió en esta sesión.
//   onCambiar:      recibe el objeto documentos actualizado
//   nombreCliente:  (opcional) para nombrar los archivos de ejemplo
//
// En el prototipo no hay servidor: los archivos subidos viven solo en la memoria del
// navegador mientras la página esté abierta. Los documentos "cargados" de ejemplo se
// ven y descargan como un PDF de muestra.
// (Falta definir dónde se guardarán los documentos reales, observación 9.8.)
//
// useConexion debe devolver { enLinea: true | false }.

import { useRef, useState } from 'react';
import { FileText, Upload, Trash2, Eye, Download } from 'lucide-react';
import { useToast } from '../../hooks/useToast.js';
import { useConexion } from '../../hooks/useConexion.js';
import { crearPdfEjemplo } from '../../utils/documentoEjemplo.js';
import Boton from '../ui/Boton.jsx';
import Insignia from '../ui/Insignia.jsx';
import Mensaje from '../ui/Mensaje.jsx';
import AvisoSinConexion from '../conexion/AvisoSinConexion.jsx';

const DOCUMENTOS = [
  { clave: 'rut', etiqueta: 'RUT', descripcion: 'Registro Único Tributario' },
  { clave: 'camara', etiqueta: 'Cámara de comercio', descripcion: 'Certificado de existencia y representación' },
  { clave: 'cedula', etiqueta: 'Cédula', descripcion: 'Cédula del cliente o del representante' },
  { clave: 'banco', etiqueta: 'Certificación bancaria', descripcion: 'Certificado de la cuenta bancaria' },
];

const TIPOS_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png'];
const TAMANO_MAXIMO_MB = 5;

// Nombre que se muestra del archivo, sea cual sea la forma en que esté guardado
const nombreDe = (valor) => {
  if (typeof valor === 'string') return valor;
  if (valor && typeof valor === 'object') return valor.nombre;
  return 'Documento cargado';
};

export default function DocumentosCliente({ documentos, onCambiar, nombreCliente = 'Cliente' }) {
  const mostrarToast = useToast();
  const { enLinea } = useConexion();

  const entradas = useRef({});          // un <input type="file"> oculto por documento
  const [errores, setErrores] = useState({});

  const cargados = DOCUMENTOS.filter((d) => documentos[d.clave]).length;

  const subir = (clave, e) => {
    const archivo = e.target.files?.[0];
    e.target.value = '';                // permite volver a elegir el mismo archivo
    if (!archivo) return;

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      setErrores({ ...errores, [clave]: 'El archivo debe ser PDF, JPG o PNG.' });
      return;
    }
    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      setErrores({ ...errores, [clave]: `El archivo supera los ${TAMANO_MAXIMO_MB} MB.` });
      return;
    }

    // Si ya había un archivo subido en esta sesión, liberamos su memoria
    const anterior = documentos[clave];
    if (anterior && typeof anterior === 'object') URL.revokeObjectURL(anterior.url);

    setErrores({ ...errores, [clave]: '' });
    onCambiar({
      ...documentos,
      [clave]: { nombre: archivo.name, url: URL.createObjectURL(archivo), tipo: archivo.type },
    });
    mostrarToast('Documento cargado correctamente');
  };

  const quitar = (clave) => {
    const anterior = documentos[clave];
    if (anterior && typeof anterior === 'object') URL.revokeObjectURL(anterior.url);

    setErrores({ ...errores, [clave]: '' });
    onCambiar({ ...documentos, [clave]: false });
    mostrarToast('Documento eliminado');
  };

  // Devuelve { url, nombre, esTemporal } para ver o descargar un documento.
  //   - Archivo subido en esta sesión: su propia dirección.
  //   - Documento de ejemplo: se genera un PDF de muestra (esTemporal = true).
  const prepararArchivo = (d, valor) => {
    if (valor && typeof valor === 'object') {
      return { url: valor.url, nombre: valor.nombre, esTemporal: false };
    }
    const nombre = typeof valor === 'string' ? valor : `${d.etiqueta} - ${nombreCliente}.pdf`;
    const pdf = crearPdfEjemplo(`${d.etiqueta} (documento de ejemplo)`, [
      `Cliente: ${nombreCliente}`,
      d.descripcion,
      '',
      'Este es un archivo de muestra del prototipo.',
      'En el sistema real aquí estaría el documento que subió el RTC.',
    ]);
    return { url: URL.createObjectURL(pdf), nombre, esTemporal: true };
  };

  // SYS-FR-019: ver el documento en una pestaña nueva
  const ver = (d, valor) => {
    const { url, esTemporal } = prepararArchivo(d, valor);
    window.open(url, '_blank', 'noopener');
    if (esTemporal) setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  // SYS-FR-019: descargar el documento a la carpeta de descargas
  const descargar = (d, valor) => {
    const { url, nombre, esTemporal } = prepararArchivo(d, valor);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    if (esTemporal) setTimeout(() => URL.revokeObjectURL(url), 1000);
    mostrarToast('Descargando documento');
  };

  return (
    <>
      <AvisoSinConexion>
        Subir, ver o descargar documentos necesita internet. Puedes consultar cuáles están cargados.
      </AvisoSinConexion>

      <p className="vc-meta" style={{ marginBottom: 14 }}>
        {cargados} de {DOCUMENTOS.length} documentos cargados · Subirlos es opcional.
        Formatos: PDF, JPG o PNG (máximo {TAMANO_MAXIMO_MB} MB).
      </p>

      {DOCUMENTOS.map((d) => {
        const valor = documentos[d.clave];
        const cargado = Boolean(valor);

        return (
          <div key={d.clave}>
            <div className="attach-item" style={{ flexWrap: 'wrap' }}>
              <FileText size={18} style={{ color: 'var(--verde-acento)', flexShrink: 0 }} aria-hidden="true" />

              <div className="att-name">
                {d.etiqueta}
                <div className="vc-meta" style={{ fontWeight: 400 }}>
                  {cargado ? nombreDe(valor) : d.descripcion}
                </div>
              </div>

              <Insignia color={cargado ? 'verde' : 'gris'}>{cargado ? 'Cargado' : 'Sin cargar'}</Insignia>

              <input
                ref={(el) => { entradas.current[d.clave] = el; }}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => subir(d.clave, e)}
                hidden
                aria-label={`Archivo de ${d.etiqueta}`}
              />

              {/* Ver y descargar: solo si el documento está cargado */}
              {cargado && (
                <>
                  <Boton
                    variante="contorno"
                    tamano="sm"
                    icono={Eye}
                    disabled={!enLinea}
                    onClick={() => ver(d, valor)}
                    aria-label={`Ver ${d.etiqueta}`}
                  >
                    Ver
                  </Boton>
                  <Boton
                    variante="contorno"
                    tamano="sm"
                    icono={Download}
                    disabled={!enLinea}
                    onClick={() => descargar(d, valor)}
                    aria-label={`Descargar ${d.etiqueta}`}
                  >
                    Descargar
                  </Boton>
                </>
              )}

              <Boton
                variante="contorno"
                tamano="sm"
                icono={Upload}
                disabled={!enLinea}
                onClick={() => entradas.current[d.clave]?.click()}
              >
                {cargado ? 'Reemplazar' : 'Subir'}
              </Boton>
              {cargado && (
                <Boton
                  variante="peligro"
                  tamano="sm"
                  icono={Trash2}
                  disabled={!enLinea}
                  onClick={() => quitar(d.clave)}
                  aria-label={`Quitar ${d.etiqueta}`}
                >
                  Quitar
                </Boton>
              )}
            </div>
            {errores[d.clave] && <Mensaje tipo="error">{errores[d.clave]}</Mensaje>}
          </div>
        );
      })}
    </>
  );
}
