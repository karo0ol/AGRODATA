// FormularioVisita: programar una visita a un cliente (M3 · SYS-FR-026).
//   - El cliente y el objetivo se eligen de listas, sin texto libre.
//   - La fecha no puede ser anterior a hoy.
//
// PROPS:
//   onGuardar:  recibe { clienteId, objetivo, fecha, hora }   (hora como 'HH:MM')
//   onCancelar: cierra sin guardar

import { useState } from 'react';
import { clientes } from '../../data/clientes.js';
import { objetivosVisita } from '../../data/catalogos.js';
import CampoTexto from '../ui/CampoTexto.jsx';
import CampoSelect from '../ui/CampoSelect.jsx';
import Boton from '../ui/Boton.jsx';
import Mensaje from '../ui/Mensaje.jsx';

// Clientes ordenados por nombre, listos para el CampoSelect
const OPCIONES_CLIENTE = [...clientes]
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  .map((c) => ({ valor: String(c.id), texto: c.nombre }));

export default function FormularioVisita({ onGuardar, onCancelar }) {
  const hoy = new Date().toLocaleDateString('en-CA');

  const [datos, setDatos] = useState({ clienteId: '', objetivo: '', fecha: hoy, hora: '08:00' });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};

    if (!datos.clienteId) nuevos.clienteId = 'Elige el cliente.';
    if (!datos.objetivo) nuevos.objetivo = 'Elige el objetivo de la visita.';
    if (!datos.fecha) nuevos.fecha = 'Elige la fecha.';
    else if (datos.fecha < hoy) nuevos.fecha = 'La fecha no puede ser anterior a hoy.';
    if (!datos.hora) nuevos.hora = 'Elige la hora.';

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    // Se devuelve el id con su tipo original (texto o número), no el texto del <select>
    const cliente = clientes.find((c) => String(c.id) === datos.clienteId);
    onGuardar({
      clienteId: cliente.id,
      objetivo: datos.objetivo,
      fecha: datos.fecha,
      hora: datos.hora,
    });
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
          etiqueta="Objetivo de la visita"
          valor={datos.objetivo}
          onChange={cambiar('objetivo')}
          opciones={objetivosVisita}
          error={errores.objetivo}
          requerido
        />
        <CampoTexto
          etiqueta="Fecha"
          tipo="date"
          valor={datos.fecha}
          onChange={cambiar('fecha')}
          min={hoy}
          error={errores.fecha}
          requerido
        />
        <CampoTexto
          etiqueta="Hora"
          tipo="time"
          valor={datos.hora}
          onChange={cambiar('hora')}
          error={errores.hora}
          requerido
        />
      </div>

      <div className="form-actions">
        <Boton variante="contorno" onClick={onCancelar}>Cancelar</Boton>
        <Boton type="submit">Programar visita</Boton>
      </div>
    </form>
  );
}