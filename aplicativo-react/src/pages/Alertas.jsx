// Alertas: recordatorios, clientes sin visita y calendario mensual (M3).
//   - Recordatorio de cada actividad 1 día antes.                          (SYS-FR-032 y 040)
//   - Clientes sin visita en los últimos 30 días.                          (SYS-FR-033)
//   - Calendario mensual con visitas, compromisos y seguimientos.          (SYS-FR-081)
//   - Botones de mes anterior, mes siguiente y mes actual.                 (SYS-FR-082)
//   - Detalle de las actividades del día seleccionado.                     (SYS-FR-083)
//   - Cada tipo de actividad se ve diferente.                              (SYS-FR-084)
//   - Sin conexión solo están los 3 meses descargados (actual + 2).        (SYS-FR-085)
//
// FORMA DE LOS DATOS:
//   visitas:     { id, clienteId, objetivo, fecha, hora, estado }
//   compromisos: { id, clienteId, tipo, descripcion, fecha, estado, seguimientoFecha? }
//   clientes:    { id, nombre, estado, ultimaVisita }
//
// COMPONENTES (carpeta components/agenda), con estas props:
//   <CalendarioMensual anio mes hoy eventosPorDia diaSeleccionado disponible onSeleccionar />
//        anio y mes (0 a 11) dicen qué mes dibujar; eventosPorDia es { 'AAAA-MM-DD': [evento] }
//   <DetalleDia fecha eventos />
//   Cada evento: { tipo: 'visita' | 'compromiso' | 'seguimiento', titulo, detalle, hora? }
//
// useConexion debe devolver { enLinea: true | false }.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BellRing, UserX, WifiOff } from 'lucide-react';
import { useConexion } from '../hooks/useConexion.js';
import { clientes } from '../data/clientes.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import { sumarDias, diasEntre, formatoFecha } from '../utils/fechas.js';
import CalendarioMensual from '../components/agenda/CalendarioMensual.jsx';
import DetalleDia from '../components/agenda/DetalleDia.jsx';

// Valores de configuración (en el SyRS están marcados con * porque se pueden ajustar)
const DIAS_AVISO = 1;          // días de anticipación del recordatorio
const DIAS_SIN_VISITA = 30;    // días sin visita para alertar
const MESES_SIN_CONEXION = 3;  // mes actual + 2 siguientes

export default function Alertas() {
  const { enLinea } = useConexion();
  const hoy = new Date().toLocaleDateString('en-CA');

  // Mes mostrado en el calendario (mes de 0 a 11) y día seleccionado
  const [vista, setVista] = useState({ anio: Number(hoy.slice(0, 4)), mes: Number(hoy.slice(5, 7)) - 1 });
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';

  // ----- ARMAR LAS ACTIVIDADES DEL CALENDARIO -----
  // Visitas programadas, compromisos pendientes y seguimientos (visitas de seguimiento
  // y fechas de seguimiento asociadas a un compromiso, SYS-FR-039)
  const eventos = [
    ...visitas
      .filter((v) => v.estado === 'Programada')
      .map((v) => ({
        tipo: v.objetivo === 'Seguimiento' ? 'seguimiento' : 'visita',
        fecha: v.fecha,
        hora: v.hora,
        titulo: nombreCliente(v.clienteId),
        detalle: v.objetivo,
      })),
    ...compromisos
      .filter((c) => c.estado === 'Pendiente')
      .map((c) => ({
        tipo: 'compromiso',
        fecha: c.fecha,
        titulo: nombreCliente(c.clienteId),
        detalle: `${c.tipo}: ${c.descripcion}`,
      })),
    ...compromisos
      .filter((c) => c.estado === 'Pendiente' && c.seguimientoFecha)
      .map((c) => ({
        tipo: 'seguimiento',
        fecha: c.seguimientoFecha,
        titulo: nombreCliente(c.clienteId),
        detalle: `Seguimiento de ${c.tipo}`,
      })),
  ];

  // Se agrupan por fecha: { '2026-11-18': [evento, evento], ... }
  const eventosPorDia = eventos.reduce((grupos, e) => {
    (grupos[e.fecha] ??= []).push(e);
    return grupos;
  }, {});

  // ----- RECORDATORIOS (SYS-FR-032 y 040) -----
  const fechaAviso = sumarDias(hoy, DIAS_AVISO);
  const recordatorios = eventosPorDia[fechaAviso] ?? [];

  // ----- CLIENTES SIN VISITA (SYS-FR-033) -----
  const sinVisita = clientes
    .filter((c) => c.estado === 'Activo')
    .filter((c) => !c.ultimaVisita || diasEntre(c.ultimaVisita, hoy) >= DIAS_SIN_VISITA)
    .map((c) => ({ ...c, dias: c.ultimaVisita ? diasEntre(c.ultimaVisita, hoy) : null }));

  // ----- NAVEGACIÓN DEL CALENDARIO (SYS-FR-082) -----
  const cambiarMes = (delta) => {
    const fecha = new Date(vista.anio, vista.mes + delta, 1);
    setVista({ anio: fecha.getFullYear(), mes: fecha.getMonth() });
    setDiaSeleccionado(null);
  };
  const volverAHoy = () => {
    setVista({ anio: Number(hoy.slice(0, 4)), mes: Number(hoy.slice(5, 7)) - 1 });
    setDiaSeleccionado(hoy);
  };

  // SYS-FR-085: sin conexión solo existen el mes actual y los 2 siguientes
  const distanciaMeses = (vista.anio - Number(hoy.slice(0, 4))) * 12 + (vista.mes - (Number(hoy.slice(5, 7)) - 1));
  const mesDisponible = enLinea || (distanciaMeses >= 0 && distanciaMeses < MESES_SIN_CONEXION);

  const tituloMes = new Date(vista.anio, vista.mes, 1).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Alertas</h2>
          <div className="subtitle">Recordatorios, clientes sin visita y calendario del mes</div>
        </div>
      </div>

      <div className="grid-2">
        {/* ----- PARA MAÑANA ----- */}
        <div className="card">
          <h3><BellRing size={16} style={{ verticalAlign: 'middle' }} /> Para mañana ({formatoFecha(fechaAviso)})</h3>
          {recordatorios.length === 0 && <p>No tienes actividades para mañana.</p>}
          {recordatorios.map((e, i) => (
            <div className="alert-card" key={i}>
              <strong>{e.titulo}</strong>
              <div className="vc-meta">{e.detalle}{e.hora ? ` · ${e.hora}` : ''}</div>
            </div>
          ))}
        </div>

        {/* ----- CLIENTES SIN VISITA ----- */}
        <div className="card">
          <h3><UserX size={16} style={{ verticalAlign: 'middle' }} /> Sin visita hace {DIAS_SIN_VISITA} días o más</h3>
          {sinVisita.length === 0 && <p>Todos tus clientes activos tienen visitas recientes.</p>}
          {sinVisita.slice(0, 6).map((c) => (
            <div className="visit-card" key={c.id}>
              <div className="vc-info">
                <div className="vc-name">{c.nombre}</div>
                <div className="vc-meta">{c.dias === null ? 'Nunca visitado' : `${c.dias} días sin visita`}</div>
              </div>
              <Link to={`/clientes/${c.id}`} className="btn btn-sm btn-outline">Ver ficha</Link>
            </div>
          ))}
          {sinVisita.length > 6 && <p className="vc-meta">y {sinVisita.length - 6} clientes más…</p>}
        </div>
      </div>

      {/* ----- CALENDARIO MENSUAL ----- */}
      <div className="card">
        <div className="toolbar">
          <div className="toolbar-left">
            <button type="button" className="btn btn-sm btn-outline" onClick={() => cambiarMes(-1)} aria-label="Mes anterior">
              <ChevronLeft size={15} />
            </button>
            <h3 style={{ margin: 0, textTransform: 'capitalize', minWidth: 160, textAlign: 'center' }}>{tituloMes}</h3>
            <button type="button" className="btn btn-sm btn-outline" onClick={() => cambiarMes(1)} aria-label="Mes siguiente">
              <ChevronRight size={15} />
            </button>
            <button type="button" className="btn btn-sm btn-outline" onClick={volverAHoy}>Mes actual</button>
          </div>

          {/* Leyenda: cada tipo se distingue por color (SYS-FR-084) */}
          <div className="chip-row">
            <span className="pill pill-verde">Visita</span>
            <span className="pill pill-amarillo">Compromiso</span>
            <span className="pill pill-morado">Seguimiento</span>
          </div>
        </div>

        {/* Aviso cuando el mes no se descargó y no hay conexión (SYS-FR-085) */}
        {!mesDisponible && (
          <div className="banner-warn" role="alert">
            <WifiOff size={15} style={{ verticalAlign: 'middle' }} /> Este mes no está descargado en tu dispositivo.
            Conéctate para consultarlo. Sin conexión puedes ver el mes actual y los 2 siguientes.
          </div>
        )}

        <CalendarioMensual
          anio={vista.anio}
          mes={vista.mes}
          hoy={hoy}
          eventosPorDia={eventosPorDia}
          diaSeleccionado={diaSeleccionado}
          disponible={mesDisponible}
          onSeleccionar={setDiaSeleccionado}
        />
      </div>

      {/* ----- DETALLE DEL DÍA (SYS-FR-083) ----- */}
      {diaSeleccionado && mesDisponible && (
        <div className="card">
          <DetalleDia fecha={diaSeleccionado} eventos={eventosPorDia[diaSeleccionado] ?? []} />
        </div>
      )}
    </>
  );
}