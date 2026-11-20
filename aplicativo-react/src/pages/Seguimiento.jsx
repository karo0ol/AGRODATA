

// Seguimiento: todo lo que el RTC tiene pendiente de retomar con sus clientes (M3 / M4).
//   - Seguimientos programados desde un compromiso.            (SYS-FR-039)
//   - Visitas programadas cuyo objetivo es un seguimiento.     (SYS-FR-029 y 030)
//   - Clientes sin visita en los últimos 30 días.              (SYS-FR-033)
//
// FORMA DE LOS DATOS (los mismos de Agenda, Alertas y Panel):
//   clientes:    { id, nombre, ultimaVisita }
//   visitas:     { id, clienteId, objetivo, fecha, hora, estado: 'Programada' | 'Realizada' }
//   compromisos: { id, clienteId, tipo, descripcion, fecha, estado, seguimientoFecha? }

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clientes } from '../data/clientes.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import { diasEntre, formatoFecha } from '../utils/fechas.js';

const DIAS_SIN_VISITA = 30;
const PESTANAS = ['Vencidos', 'Hoy', 'Próximos', 'Sin visita'];

export default function Seguimiento() {
  const hoy = new Date().toLocaleDateString('en-CA');
  const [pestana, setPestana] = useState('Vencidos');

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';

  // ----- SEGUIMIENTOS CON FECHA (de compromisos y de visitas) -----
  const delCompromiso = compromisos
    .filter((c) => c.estado === 'Pendiente' && c.seguimientoFecha)
    .map((c) => ({
      id: 'c' + c.id,
      clienteId: c.clienteId,
      fecha: c.seguimientoFecha,
      origen: 'Compromiso',
      detalle: `${c.tipo} · ${c.descripcion}`,
    }));

  const delaVisita = visitas
    .filter((v) => v.estado === 'Programada' && (v.objetivo ?? '').toLowerCase().includes('seguimiento'))
    .map((v) => ({
      id: 'v' + v.id,
      clienteId: v.clienteId,
      fecha: v.fecha,
      origen: 'Visita',
      detalle: v.objetivo + (v.hora ? ` · ${v.hora}` : ''),
    }));

  const conFecha = [...delCompromiso, ...delaVisita].sort((a, b) => a.fecha.localeCompare(b.fecha));

  const vencidos = conFecha.filter((s) => s.fecha < hoy);
  const deHoy = conFecha.filter((s) => s.fecha === hoy);
  const proximos = conFecha.filter((s) => s.fecha > hoy);

  // ----- CLIENTES SIN VISITA (SYS-FR-033) -----
  const sinVisita = clientes
    .map((c) => ({ ...c, dias: c.ultimaVisita ? diasEntre(c.ultimaVisita, hoy) : null }))
    .filter((c) => c.dias === null || c.dias >= DIAS_SIN_VISITA)
    .sort((a, b) => (b.dias ?? Infinity) - (a.dias ?? Infinity));

  const cuenta = {
    'Vencidos': vencidos.length,
    'Hoy': deHoy.length,
    'Próximos': proximos.length,
    'Sin visita': sinVisita.length,
  };

  const totalPendientes = vencidos.length + deHoy.length + proximos.length;

  // Tarjeta de un seguimiento con fecha (se reutiliza en las tres primeras pestañas)
  const renderSeguimientos = (items, claseFecha) => (
    <div className="card">
      {items.length === 0 && <p>No hay seguimientos en esta categoría.</p>}
      {items.map((s) => (
        <div className="visit-card" key={s.id}>
          <div className="vc-info">
            <div className="vc-name">{nombreCliente(s.clienteId)}</div>
            <div className="vc-meta">{s.detalle}</div>
            <div className="vc-meta">Seguimiento el {formatoFecha(s.fecha)}</div>
          </div>
          <div className="vc-actions">
            <span className={`pill ${claseFecha}`}>{s.origen}</span>
            <Link to={`/clientes/${s.clienteId}`} className="btn btn-sm btn-outline">Ver cliente</Link>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Seguimiento</h2>
          <div className="subtitle">
            {totalPendientes} seguimientos programados · {sinVisita.length} clientes sin visita
          </div>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {PESTANAS.map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pestana === p}
            className={`tab-btn ${pestana === p ? 'active' : ''}`}
            onClick={() => setPestana(p)}
          >
            {p}<span className="count">{cuenta[p]}</span>
          </button>
        ))}
      </div>

      {pestana === 'Vencidos' && renderSeguimientos(vencidos, 'pill-rojo')}
      {pestana === 'Hoy' && renderSeguimientos(deHoy, 'pill-amarillo')}
      {pestana === 'Próximos' && renderSeguimientos(proximos, 'pill-verde')}

      {pestana === 'Sin visita' && (
        <div className="card">
          {sinVisita.length === 0 && <p>Todos tus clientes tienen una visita reciente.</p>}
          {sinVisita.map((c) => (
            <div className="visit-card" key={c.id}>
              <div className="vc-info">
                <div className="vc-name">{c.nombre}</div>
                <div className="vc-meta">
                  {c.dias === null
                    ? 'Nunca se ha visitado'
                    : `Última visita el ${formatoFecha(c.ultimaVisita)} · hace ${c.dias} días`}
                </div>
              </div>
              <div className="vc-actions">
                <span className="pill pill-rojo">Sin visita</span>
                <Link to={`/clientes/${c.id}`} className="btn btn-sm btn-outline">Ver cliente</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}