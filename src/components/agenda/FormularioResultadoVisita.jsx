// FormularioResultadoVisita: registrar cómo le fue al RTC en una visita (SYS-FR-029)
// y, si quiere, programar de una vez la siguiente visita o seguimiento (SYS-FR-030).
//
// PROPS:
//   visita:        la visita: { clienteId, objetivo, fecha, hora, ... }
//   nombreCliente: nombre del cliente, para mostrarlo en el encabezado
//   onGuardar:     recibe { resultado, notas, proximaFecha?, proximoObjetivo? }
//                  (proximaFecha y proximoObjetivo solo vienen si el RTC eligió una fecha)
//   onCancelar:    cierra sin guardar

import { useState } from 'react';
import { resultadosVisita, objetivosVisita } from '../../data/catalogos.js';
import CampoTexto from '../ui/CampoTexto.jsx';
import CampoSelect from '../ui/CampoSelect.jsx';
import Boton from '../ui/Boton.jsx';
import Mensaje from '../ui/Mensaje.jsx';

export default function FormularioResultadoVisita({ visita, nombreCliente, onGuardar, onCancelar }) {
  const hoy = new Date().toLocaleDateString('en-CA');
  // La siguiente visita no puede ser antes de hoy ni antes de la visita que se está cerrando
  const fechaMinima = hoy > visita.fecha ? hoy : visita.fecha;

  const [datos, setDatos] = useState({
    resultado: '',
    notas: '',
    proximaFecha: '',
    proximoObjetivo: 'Seguimiento',
  });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};

    if (!datos.resultado) nuevos.resultado = 'Elige cómo resultó la visita.';
    if (datos.proximaFecha && datos.proximaFecha < fechaMinima) {
      nuevos.proximaFecha = 'La siguiente visita no puede ser anterior a esta fecha.';
    }
    if (datos.proximaFecha && !datos.proximoObjetivo) {
      nuevos.proximoObjetivo = 'Elige el objetivo de la siguiente visita.';
    }

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const salida = { resultado: datos.resultado, notas: datos.notas.trim() };
    if (datos.proximaFecha) {
      salida.proximaFecha = datos.proximaFecha;
      salida.proximoObjetivo = datos.proximoObjetivo;
    }
    onGuardar(salida);
  };

  return (
    <form onSubmit={enviar} noValidate>
      {/* Datos de la visita que se está cerrando */}
      <p style={{ marginBottom: 16 }}>
        <strong>{nombreCliente}</strong>
        <span className="vc-meta" style={{ display: 'block' }}>
          {visita.objetivo} · {visita.fecha}{visita.hora ? ` · ${visita.hora}` : ''}
        </span>
      </p>

      {Object.keys(errores).length > 0 && (
        <Mensaje tipo="error">Revisa los campos marcados en rojo.</Mensaje>
      )}

      <div className="form-grid">
        <CampoSelect
          etiqueta="Resultado de la visita"
          valor={datos.resultado}
          onChange={cambiar('resultado')}
          opciones={resultadosVisita}
          error={errores.resultado}
          requerido
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <CampoTexto
            etiqueta="Notas"
            valor={datos.notas}
            onChange={cambiar('notas')}
            multilinea
            maxLength={500}
            placeholder="Qué se habló, qué pidió el cliente, qué quedó pendiente…"
            ayuda="Opcional."
          />
        </div>
      </div>

      {/* Programar la siguiente visita o seguimiento (opcional) */}
      <div className="section-label">Siguiente visita (opcional)</div>
      <div className="form-grid">
        <CampoTexto
          etiqueta="Fecha"
          tipo="date"
          valor={datos.proximaFecha}
          onChange={cambiar('proximaFecha')}
          min={fechaMinima}
          error={errores.proximaFecha}
        />
        {datos.proximaFecha && (
          <CampoSelect
            etiqueta="Objetivo"
            valor={datos.proximoObjetivo}
            onChange={cambiar('proximoObjetivo')}
            opciones={objetivosVisita}
            placeholder={null}
            error={errores.proximoObjetivo}
          />
        )}
      </div>

      <div className="form-actions">
        <Boton variante="contorno" onClick={onCancelar}>Cancelar</Boton>
        <Boton type="submit">
          {datos.proximaFecha ? 'Guardar y programar siguiente' : 'Guardar resultado'}
        </Boton>
      </div>
    </form>
  );
}