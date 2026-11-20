// Reportes: panel con las métricas propias del RTC (M7).
//   - Ventas, clientes que compraron, visitas realizadas y cumplimiento de compromisos.
//   - Ventas por producto y clientes con más compras.
//   - Oportunidades por estado (son proyecciones, NO ventas, SYS-FR-043).
//   - Filtro por periodo.
//   - Exportar los datos a Excel/CSV se hace en la pantalla Importar / Exportar.
//   - No hay comparación entre distribuidores: el RTC solo ve sus propios datos.
//
// FORMA DE LOS DATOS (los mismos de las demás páginas):
//   ventas:        { id, clienteId, producto?, cantidad?, fecha, valorTotal }  (valorTotal puede ser null)
//   clientes:      { id, nombre }
//   visitas:       { id, clienteId, fecha, estado: 'Programada' | 'Realizada' }
//   compromisos:   { id, clienteId, fecha, estado: 'Pendiente' | 'Cumplido' | 'Incumplido' }
//   oportunidades: { id, clienteId, estado, fecha }

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, CalendarCheck, Handshake, Download } from 'lucide-react';
import { useDatos } from '../hooks/useDatos.js';
import { clientes } from '../data/clientes.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';

const PERIODOS = [
  { clave: 'mes', texto: 'Este mes' },
  { clave: 'trimestre', texto: 'Últimos 3 meses' },
  { clave: 'anio', texto: 'Este año' },
  { clave: 'todo', texto: 'Todo el historial' },
];

const ESTADOS_OPORTUNIDAD = [
  'Nueva', 'En contacto', 'En negociación', 'Convertida', 'En pausa', 'Sin intención por ahora',
];

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

// Devuelve la fecha (AAAA-MM-DD) desde la que empieza el periodo elegido
function desdePeriodo(clave, hoy) {
  if (clave === 'mes') return hoy.slice(0, 7) + '-01';
  if (clave === 'anio') return hoy.slice(0, 4) + '-01-01';
  if (clave === 'trimestre') {
    const f = new Date(hoy + 'T00:00:00');
    f.setDate(1);                      // primero el día 1, para que restar meses no se desborde
    f.setMonth(f.getMonth() - 2);      // mes actual + 2 anteriores
    return f.toLocaleDateString('en-CA');
  }
  return '0000-00-00';                 // "todo": cualquier fecha cumple
}

// Barra horizontal reutilizable (usa las clases funnel-* del CSS)
function Barra({ etiqueta, valor, texto, maximo }) {
  const porcentaje = maximo > 0 ? Math.round((valor / maximo) * 100) : 0;
  return (
    <div className="funnel-row">
      <div className="fr-top"><span>{etiqueta}</span><span>{texto}</span></div>
      <div className="funnel-bar-bg">
        <div className="funnel-bar-fill" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}

export default function Reportes() {
  const { ventas, oportunidades } = useDatos();
  const hoy = new Date().toLocaleDateString('en-CA');
  const [periodo, setPeriodo] = useState('mes');

  const desde = desdePeriodo(periodo, hoy);
  const enPeriodo = (fecha) => fecha >= desde && fecha <= hoy;

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';

  // ----- VENTAS -----
  const ventasP = ventas.filter((v) => enPeriodo(v.fecha));
  const totalVentas = ventasP.reduce((suma, v) => suma + (v.valorTotal || 0), 0);
  const ventasSinPrecio = ventasP.filter((v) => v.valorTotal == null).length;
  const clientesQueCompraron = new Set(ventasP.map((v) => v.clienteId)).size;

  // Ventas por producto (las 6 de mayor valor)
  const porProducto = Object.entries(
    ventasP.reduce((acc, v) => {
      const nombre = v.producto ?? 'Sin producto';
      acc[nombre] = (acc[nombre] ?? 0) + (v.valorTotal || 0);
      return acc;
    }, {}),
  )
    .map(([nombre, valor]) => ({ nombre, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);
  const maxProducto = porProducto[0]?.valor ?? 0;

  // Clientes con más compras (los 5 de mayor valor)
  const topClientes = Object.entries(
    ventasP.reduce((acc, v) => {
      acc[v.clienteId] = acc[v.clienteId] ?? { total: 0, cantidad: 0 };
      acc[v.clienteId].total += v.valorTotal || 0;
      acc[v.clienteId].cantidad += 1;
      return acc;
    }, {}),
  )
    .map(([id, datos]) => ({ id, ...datos }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // ----- VISITAS Y COMPROMISOS -----
  const visitasRealizadas = visitas.filter((v) => v.estado === 'Realizada' && enPeriodo(v.fecha)).length;

  const compromisosP = compromisos.filter((c) => enPeriodo(c.fecha));
  const cumplidos = compromisosP.filter((c) => c.estado === 'Cumplido').length;
  const cumplimiento = compromisosP.length === 0 ? null : Math.round((cumplidos / compromisosP.length) * 100);

  // ----- OPORTUNIDADES (proyecciones, no ventas) -----
  const oportunidadesP = oportunidades.filter((o) => enPeriodo(o.fecha));
  const cuentaEstado = (estado) => oportunidadesP.filter((o) => o.estado === estado).length;
  const maxOportunidades = Math.max(0, ...ESTADOS_OPORTUNIDAD.map(cuentaEstado));
  const convertidas = cuentaEstado('Convertida');
  const tasaConversion = oportunidadesP.length === 0 ? null : Math.round((convertidas / oportunidadesP.length) * 100);

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Reportes</h2>
          <div className="subtitle">Tus métricas de venta y seguimiento</div>
        </div>
        <div className="toolbar-left">
          <select
            className="month-select"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            aria-label="Periodo del reporte"
          >
            {PERIODOS.map((p) => <option key={p.clave} value={p.clave}>{p.texto}</option>)}
          </select>
          <Link to="/importar-exportar" className="btn btn-outline">
            <Download size={16} /> Exportar datos
          </Link>
        </div>
      </div>

      {/* ----- CIFRAS ----- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label"><DollarSign size={14} /> Ventas del periodo</div>
          <div className="kpi-value">{formatoPesos(totalVentas)}</div>
          <div className="kpi-delta up">
            {ventasP.length} venta(s){ventasSinPrecio > 0 ? ` · ${ventasSinPrecio} sin precio` : ''}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Users size={14} /> Clientes que compraron</div>
          <div className="kpi-value">{clientesQueCompraron}</div>
          <div className="kpi-delta up">de {clientes.length} clientes</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><CalendarCheck size={14} /> Visitas realizadas</div>
          <div className="kpi-value">{visitasRealizadas}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Handshake size={14} /> Cumplimiento de compromisos</div>
          <div className="kpi-value">{cumplimiento === null ? '—' : `${cumplimiento}%`}</div>
          <div className="kpi-delta up">{cumplidos} de {compromisosP.length} cumplidos</div>
        </div>
      </div>

      {ventasSinPrecio > 0 && (
        <div className="banner-warn">
          {ventasSinPrecio} venta(s) del periodo no tienen precio, así que <strong>no suman</strong> al
          valor total. Digita el precio del producto en el Catálogo para las próximas ventas.
        </div>
      )}

      <div className="grid-2">
        {/* ----- VENTAS POR PRODUCTO ----- */}
        <div className="card">
          <h3>Ventas por producto</h3>
          {porProducto.length === 0 && <p>No hay ventas en este periodo.</p>}
          {porProducto.map((p) => (
            <Barra key={p.nombre} etiqueta={p.nombre} valor={p.valor} texto={formatoPesos(p.valor)} maximo={maxProducto} />
          ))}
        </div>

        {/* ----- OPORTUNIDADES POR ESTADO ----- */}
        <div className="card">
          <h3>
            Oportunidades por estado
            <span className="pill pill-gris">Proyectado</span>
          </h3>
          {oportunidadesP.length === 0 && <p>No hay oportunidades en este periodo.</p>}
          {oportunidadesP.length > 0 && (
            <>
              {ESTADOS_OPORTUNIDAD.map((estado) => (
                <Barra key={estado} etiqueta={estado} valor={cuentaEstado(estado)} texto={cuentaEstado(estado)} maximo={maxOportunidades} />
              ))}
              <p className="vc-meta">
                Convertidas: {convertidas} de {oportunidadesP.length} ({tasaConversion}%). Las cantidades
                proyectadas no se cuentan como ventas.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ----- CLIENTES CON MÁS COMPRAS ----- */}
      <div className="card">
        <h3>Clientes con más compras</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Cliente</th><th>Ventas</th><th>Valor total</th></tr>
            </thead>
            <tbody>
              {topClientes.length === 0 && (
                <tr><td colSpan={3}>No hay ventas en este periodo.</td></tr>
              )}
              {topClientes.map((c) => (
                <tr key={c.id}>
                  <td><Link to={`/clientes/${c.id}`}>{nombreCliente(c.id)}</Link></td>
                  <td>{c.cantidad}</td>
                  <td>{formatoPesos(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}