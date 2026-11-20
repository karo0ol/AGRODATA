// FormularioCliente: crear o editar un cliente (M2 · SYS-FR-008, 009, 010, 011).
//   - Departamento y municipio se eligen de listas, sin texto libre.        (SYS-FR-009)
//   - Tipo de cultivo y productos de interés (los del catálogo).            (SYS-FR-011)
//   - El NIT es opcional, pero si se escribe se valida y no puede repetirse.
//   - Al crear, el cliente exige la autorización de datos personales (Ley 1581 de 2012).
//
// PROPS:
//   cliente:    si se envía, el formulario EDITA ese cliente; si no, crea uno nuevo
//   existentes: lista de clientes para revisar NIT repetidos (por defecto, los de data/clientes.js)
//   onGuardar:  al CREAR recibe el cliente completo ya armado (con id, documentos vacíos...)
//               al EDITAR recibe solo los campos del formulario (la página los mezcla con el cliente)
//   onCancelar: cierra sin guardar
//
// La zona del cliente se toma del municipio (igual que al convertir un prospecto).

import { useState } from 'react';
import { clientes } from '../../data/clientes.js';
import { productos } from '../../data/productos.js';
import { departamentos, municipiosPorDepartamento } from '../../data/catalogos.js';
import CampoTexto from '../ui/CampoTexto.jsx';
import CampoSelect from '../ui/CampoSelect.jsx';
import Boton from '../ui/Boton.jsx';
import Mensaje from '../ui/Mensaje.jsx';

const TIPOS = ['B2B', 'B2C'];
const ESTADOS = ['Activo', 'Inactivo', 'Potencial'];

// NIT sin puntos, guiones ni dígito de verificación (misma regla que la importación)
const nitNormalizado = (valor) => String(valor ?? '').split('-')[0].replace(/\D/g, '');

export default function FormularioCliente({ cliente, existentes = clientes, onGuardar, onCancelar }) {
  const editando = Boolean(cliente);

  const [datos, setDatos] = useState({
    nombre: cliente?.nombre ?? '',
    nit: cliente?.nit ?? '',
    departamento: cliente?.departamento ?? '',
    municipio: cliente?.municipio ?? '',
    tipo: cliente?.tipo ?? '',
    estado: cliente?.estado ?? 'Activo',
    cultivo: cliente?.cultivo ?? '',
    productosInteres: cliente?.productosInteres ?? [],
  });
  const [autoriza, setAutoriza] = useState(false);
  const [errores, setErrores] = useState({});

  // Devuelve una función que guarda el valor de un campo
  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  // Si cambia el departamento, el municipio anterior ya no sirve
  const cambiarDepartamento = (valor) =>
    setDatos((d) => ({ ...d, departamento: valor, municipio: '' }));

  const alternarProducto = (nombre) =>
    setDatos((d) => ({
      ...d,
      productosInteres: d.productosInteres.includes(nombre)
        ? d.productosInteres.filter((p) => p !== nombre)
        : [...d.productosInteres, nombre],
    }));

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};

    if (datos.nombre.trim().length < 3) nuevos.nombre = 'Escribe el nombre del cliente (mínimo 3 letras).';

    // NIT opcional; si se escribe, debe verse como un NIT y no estar repetido
    const nit = datos.nit.trim();
    if (nit !== '') {
      const digitos = nitNormalizado(nit);
      if (!/^[\d.\-\s]+$/.test(nit) || digitos.length < 6 || digitos.length > 11) {
        nuevos.nit = 'Escribe un NIT válido: solo números, puntos y guion (ejemplo: 900.123.456-7).';
      } else if (existentes.some((c) => c.id !== cliente?.id && nitNormalizado(c.nit) === digitos)) {
        nuevos.nit = 'Ya existe un cliente con ese NIT.';
      }
    }

    if (!datos.departamento) nuevos.departamento = 'Elige el departamento.';
    if (!datos.municipio) nuevos.municipio = 'Elige el municipio.';
    if (!datos.tipo) nuevos.tipo = 'Elige el tipo de cliente.';
    if (!editando && !autoriza) nuevos.autoriza = 'Necesitas la autorización del cliente para registrar sus datos.';

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const base = {
      nombre: datos.nombre.trim(),
      nit,
      departamento: datos.departamento,
      municipio: datos.municipio,
      zona: datos.municipio,
      tipo: datos.tipo,
      estado: datos.estado,
      cultivo: datos.cultivo.trim(),
      productosInteres: datos.productosInteres,
    };

    if (editando) {
      onGuardar(base);
    } else {
      onGuardar({
        ...base,
        id: 'C' + Date.now(),
        documentos: { rut: false, camara: false, cedula: false, banco: false },
        ultimaVisita: '',
        autorizaDatos: true,
      });
    }
  };

  return (
    // noValidate: los mensajes de error los muestra este formulario, en español y junto a cada campo
    <form onSubmit={enviar} noValidate>
      {Object.keys(errores).length > 0 && (
        <Mensaje tipo="error">Revisa los campos marcados en rojo.</Mensaje>
      )}

      <div className="form-grid">
        <CampoTexto
          etiqueta="Nombre o razón social"
          valor={datos.nombre}
          onChange={cambiar('nombre')}
          error={errores.nombre}
          requerido
        />
        <CampoTexto
          etiqueta="NIT"
          valor={datos.nit}
          onChange={cambiar('nit')}
          placeholder="900.123.456-7"
          ayuda="Opcional. Puedes escribirlo con o sin puntos y guion."
          error={errores.nit}
        />
        <CampoSelect
          etiqueta="Departamento"
          valor={datos.departamento}
          onChange={cambiarDepartamento}
          opciones={departamentos}
          error={errores.departamento}
          requerido
        />
        <CampoSelect
          etiqueta="Municipio"
          valor={datos.municipio}
          onChange={cambiar('municipio')}
          opciones={municipiosPorDepartamento[datos.departamento] ?? []}
          placeholder={datos.departamento ? 'Selecciona…' : 'Primero elige el departamento'}
          disabled={!datos.departamento}
          error={errores.municipio}
          requerido
        />
        {datos.municipio && (
          <p className="vc-meta" style={{ gridColumn: '1 / -1', marginTop: -6 }}>
            Zona asignada: <strong>{datos.municipio}</strong> (se toma automáticamente del municipio).
          </p>
        )}
        <CampoSelect
          etiqueta="Tipo de cliente"
          valor={datos.tipo}
          onChange={cambiar('tipo')}
          opciones={TIPOS}
          error={errores.tipo}
          requerido
        />
        <CampoSelect
          etiqueta="Estado"
          valor={datos.estado}
          onChange={cambiar('estado')}
          opciones={ESTADOS}
          placeholder={null}
        />
        <CampoTexto
          etiqueta="Tipo de cultivo"
          valor={datos.cultivo}
          onChange={cambiar('cultivo')}
          placeholder="Ejemplo: café, papa, aguacate"
        />

        {/* Productos de interés: se eligen del catálogo (SYS-FR-011) */}
        <div className="fld" style={{ gridColumn: '1 / -1' }}>
          <label id="cli-productos">Productos de interés</label>
          <div className="chip-row" role="group" aria-labelledby="cli-productos">
            {productos.length === 0 && <span className="vc-meta">El catálogo aún no tiene productos.</span>}
            {productos.map((p) => {
              const elegido = datos.productosInteres.includes(p.nombre);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`chip ${elegido ? 'selected' : ''}`}
                  aria-pressed={elegido}
                  onClick={() => alternarProducto(p.nombre)}
                >
                  {p.nombre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Autorización de datos personales: solo al crear */}
      {!editando && (
        <>
          <label className="privacy-check">
            <input
              type="checkbox"
              checked={autoriza}
              onChange={(e) => setAutoriza(e.target.checked)}
              aria-invalid={errores.autoriza ? true : undefined}
            />
            <span>
              El cliente autorizó el tratamiento de sus datos personales para fines comerciales
              (Ley 1581 de 2012). *
            </span>
          </label>
          {errores.autoriza && (
            <small role="alert" style={{ display: 'block', marginTop: 4, fontSize: 12, color: 'var(--rojo)' }}>
              {errores.autoriza}
            </small>
          )}
        </>
      )}

      <div className="form-actions">
        <Boton variante="contorno" onClick={onCancelar}>Cancelar</Boton>
        <Boton type="submit">{editando ? 'Guardar cambios' : 'Crear cliente'}</Boton>
      </div>
    </form>
  );
}