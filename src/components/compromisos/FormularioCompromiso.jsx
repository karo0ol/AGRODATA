// FormularioCompromiso: registrar algo pactado con un cliente (M4 · SYS-FR-038 y 039).
//   - Cliente, producto (opcional) y tipo se eligen de listas.
//   - Si se escribe una fecha de seguimiento, la página la programa como actividad.
//
// PROPS:
//   onGuardar:  recibe { clienteId, productoId?, tipo, descripcion, observaciones,
//                        fecha, seguimientoFecha? }
//   onCancelar: cierra sin guardar
// La página agrega el estado ('Pendiente') y el id al guardar.

import { useState } from 'react';
import { clientes } from '../../data/clientes.js';
import { productos } from '../../data/productos.js';
import { tiposCompromiso } from '../../data/catalogos.js';
import CampoTexto from '../ui/CampoTexto.jsx';
import CampoSelect from '../ui/CampoSelect.jsx';
import Boton from '../ui/Boton.jsx';
import Mensaje from '../ui/Mensaje.jsx';

const OPCIONES_CLIENTE = [...clientes]
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  .map((c) => ({ valor: String(c.id), texto: c.nombre }));

const OPCIONES_PRODUCTO = productos.map((p) => ({ valor: String(p.id), texto: p.nombre }));

export default function FormularioCompromiso({ onGuardar, onCancelar }) {
  const hoy = new Date().toLocaleDateString('en-CA');

  const [datos, setDatos] = useState({
    clienteId: '',
    productoId: '',
    tipo: '',
    descripcion: '',
    observaciones: '',
    fecha: '',
    seguimientoFecha: '',
  });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};

    if (!datos.clienteId) nuevos.clienteId = 'Elige el cliente.';
    if (!datos.tipo) nuevos.tipo = 'Elige el tipo de compromiso.';
    if (datos.descripcion.trim().length < 5) {
      nuevos.descripcion = 'Describe el compromiso (mínimo 5 letras).';
    }
    if (!datos.fecha) nuevos.fecha = 'Elige la fecha del compromiso.';
    else if (datos.fecha < hoy) nuevos.fecha = 'La fecha no puede ser anterior a hoy.';
    if (datos.seguimientoFecha && datos.fecha && datos.seguimientoFecha < datos.fecha) {
      nuevos.seguimientoFecha = 'El seguimiento no puede ser antes de la fecha del compromiso.';
    }

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    // Se devuelven los ids con su tipo original, no el texto del <select>
    const cliente = clientes.find((c) => String(c.id) === datos.clienteId);
    const producto = productos.find((p) => String(p.id) === datos.productoId);

    const salida = {
      clienteId: cliente.id,
      tipo: datos.tipo,
      descripcion: datos.descripcion.trim(),
      observaciones: datos.observaciones.trim(),
      fecha: datos.fecha,
    };
    if (producto) salida.productoId = producto.id;
    if (datos.seguimientoFecha) salida.seguimientoFecha = datos.seguimientoFecha;
    onGuardar(salida);
  };

  return (
    <form onSubmit={enviar} noValidate>
      {Object.keys(errores).length > 0 && (
        <Mensaje tipo="error">Revisa los campos marcados en rojo.</Mensaje>
      )}

      <div className="form-grid">
        <CampoSelect
          etiqueta="Cliente"
          valor={datos.clienteId}
          onChange={cambiar('clienteId')}
          opciones={OPCIONES_CLIENTE}
          error={errores.clienteId}
          requerido
        />
        <CampoSelect
          etiqueta="Tipo de compromiso"
          valor={datos.tipo}
          onChange={cambiar('tipo')}
          opciones={tiposCompromiso}
          error={errores.tipo}
          requerido
        />
        <CampoSelect
          etiqueta="Producto (opcional)"
          valor={datos.productoId}
          onChange={cambiar('productoId')}
          opciones={OPCIONES_PRODUCTO}
          placeholder="Sin producto"
        />
        <CampoTexto
          etiqueta="Fecha del compromiso"
          tipo="date"
          valor={datos.fecha}
          onChange={cambiar('fecha')}
          min={hoy}
          error={errores.fecha}
          requerido
        />
      </div>

      <CampoTexto
        etiqueta="Descripción"
        valor={datos.descripcion}
        onChange={cambiar('descripcion')}
        placeholder="Ej: Llevar muestra de fungicida"
        error={errores.descripcion}
        requerido
      />
      <CampoTexto
        etiqueta="Observaciones (opcional)"
        valor={datos.observaciones}
        onChange={cambiar('observaciones')}
        multilinea
      />
      <CampoTexto
        etiqueta="Programar seguimiento (opcional)"
        tipo="date"
        valor={datos.seguimientoFecha}
        onChange={cambiar('seguimientoFecha')}
        min={datos.fecha || hoy}
        ayuda="Si eliges una fecha, queda como actividad de seguimiento."
        error={errores.seguimientoFecha}
      />

      <div className="form-actions">
        <Boton variante="contorno" onClick={onCancelar}>Cancelar</Boton>
        <Boton type="submit">Guardar compromiso</Boton>
      </div>
    </form>
  );
}
