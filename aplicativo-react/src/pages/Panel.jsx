// Panel: pantalla de inicio del RTC (M7 · SYS-FR-060, SYS-US-005).
// Muestra: resumen de ventas del mes, próximas visitas, compromisos pendientes,
// clientes que requieren seguimiento (sin visita en 30 días, SYS-FR-033)
// y las actividades programadas.
//
// FORMA DE LOS DATOS que espera este archivo (src/data/*.js, todos arrays):
//   clientes:     { id, nombre, ultimaVisita: 'AAAA-MM-DD' }
//   visitas:      { id, clienteId, objetivo, fecha: 'AAAA-MM-DD', hora: 'HH:MM', estado: 'Programada' | 'Realizada' }
//   compromisos:  { id, clienteId, tipo, descripcion, fecha: 'AAAA-MM-DD', estado: 'Pendiente' | 'Cumplido' | 'Incumplido' }
//   ventas:       { id, clienteId, fecha: 'AAAA-MM-DD', valorTotal }   (valorTotal puede ser null si el producto no tiene precio)

import { Link } from 'react-router-dom';
import { CalendarCheck, Handshake, UserX, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { clientes } from '../data/clientes.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import { useDatos } from '../hooks/useDatos.js';

export default function Panel() {
  const { ventas } = useDatos();
  const { usuario } = useAuth();

  // ----- FECHAS -----
  // "en-CA" devuelve la fecha local como AAAA-MM-DD, igual que los datos.
  const hoy = new Date().toLocaleDateString('en-CA');
  const mesActual = hoy.slice(0, 7);   // AAAA-MM

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';
  const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

  // ----- CÁLCULOS -----
  // Próximas visitas: programadas desde hoy, de la más cercana a la más lejana
  const proximasVisitas = visitas
    .filter((v) => v.estado === 'Programada' && v.fecha >= hoy)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5);

  // Compromisos pendientes, los más próximos primero
  const compromisosPendientes = compromisos
    .filter((c) => c.estado === 'Pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  // Clientes que requieren seguimiento: sin visita hace más de 30 días
  const clientesSeguimiento = clientes
    .map((c) => ({
      ...c,
      dias: Math.floor((new Date(hoy) - new Date(c.ultimaVisita)) / 86400000),
    }))
    .filter((c) => c.dias > 30)
    .sort((a, b) => b.dias - a.dias)
    .slice(0, 5);

  // Ventas del mes: suma de las ventas con fecha en el mes actual
  const ventasMes = ventas.filter((v) => v.fecha.startsWith(mesActual));
  const totalMes = ventasMes.reduce((suma, v) => suma + (v.valorTotal || 0), 0);

  // Actividades programadas = visitas programadas + compromisos pendientes, mezcladas por fecha
  const actividades = [
    ...visitas
      .filter((v) => v.estado === 'Programada' && v.fecha >= hoy)
      .map((v) => ({ id: 'v' + v.id, fecha: v.fecha, titulo: 'Visita · ' + nombreCliente(v.clienteId), detalle: v.objetivo, clase: 'pill-verde', tipo: 'Visita' })),
    ...compromisos
      .filter((c) => c.estado === 'Pendiente')
      .map((c) => ({ id: 'c' + c.id, fecha: c.fecha, titulo: 'Compromiso · ' + nombreCliente(c.clienteId), detalle: c.tipo, clase: 'pill-amarillo', tipo: 'Compromiso' })),
  ]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 6);

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Hola, {usuario.nombre.split(' ')[0]}</h2>
          <div className="subtitle">Tu resumen comercial de hoy</div>
        </div>
      </div>

      {/* ----- CIFRAS ----- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label"><DollarSign size={14} /> Ventas del mes</div>
          <div className="kpi-value">{formatoPesos(totalMes)}</div>
          <div className="kpi-delta up">{ventasMes.length} venta(s) registrada(s)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><CalendarCheck size={14} /> Próximas visitas</div>
          <div className="kpi-value">{proximasVisitas.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Handshake size={14} /> Compromisos pendientes</div>
          <div className="kpi-value">{compromisosPendientes.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><UserX size={14} /> Clientes por seguir</div>
          <div className="kpi-value">{clientesSeguimiento.length}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* ----- PRÓXIMAS VISITAS ----- */}
        <div className="card">
          <h3>Próximas visitas <Link to="/agenda" className="pill pill-gris">Ver agenda</Link></h3>
          {proximasVisitas.length === 0 && <p>No tienes visitas programadas.</p>}
          {proximasVisitas.map((v) => (
            <div className="visit-card" key={v.id}>
              <div className="vc-info">
                <div className="vc-name">{nombreCliente(v.clienteId)}</div>
                <div className="vc-meta">{v.objetivo} · {v.fecha} {v.hora}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ----- COMPROMISOS PENDIENTES ----- */}
        <div className="card">
          <h3>Compromisos pendientes <Link to="/compromisos" className="pill pill-gris">Ver todos</Link></h3>
          {compromisosPendientes.length === 0 && <p>No hay compromisos pendientes.</p>}
          {compromisosPendientes.map((c) => (
            <div className="visit-card" key={c.id}>
              <div className="vc-info">
                <div className="vc-name">{nombreCliente(c.clienteId)}</div>
                <div className="vc-meta">{c.tipo} · para el {c.fecha}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----- CLIENTES QUE REQUIEREN SEGUIMIENTO ----- */}
      <div className="card">
        <h3>Clientes que requieren seguimiento <Link to="/seguimiento" className="pill pill-gris">Ver seguimiento</Link></h3>
        <div className="alert-strip">
          {clientesSeguimiento.length === 0 && <p>Todos tus clientes tienen visitas recientes.</p>}
          {clientesSeguimiento.map((c) => (
            <Link to={`/clientes/${c.id}`} className="alert-card a-amarillo" key={c.id}>
              <div className="a-body">
                <div className="a-title">{c.nombre}</div>
                <div className="a-sub">Sin visita hace {c.dias} días</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ----- ACTIVIDADES PROGRAMADAS ----- */}
      <div className="card">
        <h3>Actividades programadas</h3>
        {actividades.length === 0 && <p>No hay actividades programadas.</p>}
        {actividades.map((a) => (
          <div className="timeline-item" key={a.id}>
            <div className="ti-dot"></div>
            <div>
              <div className="ti-title">{a.titulo}</div>
              <div className="ti-date">{a.fecha} · {a.detalle}</div>
            </div>
            <span className={`pill ${a.clase}`} style={{ marginLeft: 'auto' }}>{a.tipo}</span>
          </div>
        ))}
      </div>
    </>
  );
}