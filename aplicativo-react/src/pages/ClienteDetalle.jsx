// ClienteDetalle: ficha completa de un cliente (M2 · SYS-FR-010, 011, 012, 014 a 019;
// M3 · SYS-FR-031; M4 · SYS-FR-041, 042; M6 · SYS-FR-052).
// Se abre desde la lista de Clientes con la ruta /clientes/:id
//
// Pestañas: Resumen · Visitas · Compras · Compromisos · Documentos
//
// FORMA DE LOS DATOS que espera este archivo (src/data/*.js):
//   clientes:     { id, nombre, nit, zona, departamento, municipio, tipo, estado, documentos,
//                   ultimaVisita, cultivo?, productosInteres?: [texto] }
//   visitas:      { id, clienteId, objetivo, fecha, hora, estado, resultado?, notas? }
//   compromisos:  { id, clienteId, tipo, descripcion, fecha, estado }
//   ventas:       { id, clienteId, fecha, producto?, cantidad?, valorTotal }   (valorTotal puede ser null)

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, MapPin, Map as MapaIcono, Sprout } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { useConexion } from '../hooks/useConexion.js';
import { clientes } from '../data/clientes.js';
import { visitas } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import { useDatos } from '../hooks/useDatos.js';
import Modal from '../components/ui/Modal.jsx';
import FormularioCliente from '../components/clientes/FormularioCliente.jsx';
import HistorialCliente from '../components/clientes/HistorialCliente.jsx';
import DocumentosCliente from '../components/clientes/DocumentosCliente.jsx';
import MapaCliente from '../components/clientes/MapaCliente.jsx';
import AvisoSinConexion from '../components/conexion/AvisoSinConexion.jsx';
import ResumenCumplimiento from '../components/compromisos/ResumenCumplimiento.jsx';

const PESTANAS = ['Resumen', 'Visitas', 'Compras', 'Compromisos', 'Documentos'];
const COLOR_ESTADO = { Activo: 'pill-verde', Inactivo: 'pill-gris', Potencial: 'pill-amarillo' };
const COLOR_COMPROMISO = { Pendiente: 'pill-amarillo', Cumplido: 'pill-verde', Incumplido: 'pill-rojo' };

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

export default function ClienteDetalle() {
  const { ventas } = useDatos();
  // useParams lee el ":id" de la dirección. Siempre llega como texto.
  const { id } = useParams();
  const mostrarToast = useToast();
  const { enLinea } = useConexion();

  // El cliente vive en el estado para que las ediciones se vean de inmediato
  const [cliente, setCliente] = useState(() => clientes.find((c) => String(c.id) === id));
  const [pestana, setPestana] = useState('Resumen');
  const [editando, setEditando] = useState(false);
  const [verMapa, setVerMapa] = useState(false);   // ventana con el mapa del cliente

  // Si el id de la dirección no existe, mostramos un aviso en vez de romper la pantalla
  if (!cliente) {
    return (
      <div className="card">
        <h3>Cliente no encontrado</h3>
        <p>No existe un cliente con ese identificador.</p>
        <Link to="/clientes" className="btn btn-primary" style={{ marginTop: 14 }}>
          <ArrowLeft size={16} /> Volver a clientes
        </Link>
      </div>
    );
  }

  // ----- DATOS DE ESTE CLIENTE -----
  const susVisitas = visitas.filter((v) => v.clienteId === cliente.id);
  const susCompromisos = compromisos.filter((c) => c.clienteId === cliente.id);
  const susVentas = ventas
    .filter((v) => v.clienteId === cliente.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  const totalCompras = susVentas.reduce((suma, v) => suma + (v.valorTotal || 0), 0);

  // SYS-FR-012: cambiar el estado del cliente (activo, inactivo, potencial)
  const cambiarEstado = (e) => {
    setCliente({ ...cliente, estado: e.target.value });
    mostrarToast('Estado actualizado');
  };

  // SYS-FR-010: lo llama FormularioCliente al guardar la edición
  const guardarEdicion = (datos) => {
    setCliente({ ...cliente, ...datos });
    setEditando(false);
    mostrarToast('Cliente actualizado correctamente');
  };

  return (
    <>
      <Link to="/clientes" className="back-to-login" style={{ color: 'var(--gris-texto)', marginTop: 0 }}>
        <ArrowLeft size={14} style={{ verticalAlign: 'middle' }} /> Volver a clientes
      </Link>

      {/* ----- ENCABEZADO DE LA FICHA ----- */}
      <div className="ficha-head" style={{ marginTop: 12 }}>
        <div className="fh-info" style={{ flex: 1 }}>
          <div className="fh-name">{cliente.nombre}</div>
          <div className="fh-meta">
            <MapPin size={13} style={{ verticalAlign: 'middle' }} /> {cliente.municipio}, {cliente.departamento}
            {' · '}NIT {cliente.nit || 'sin registrar'}
            {' · '}{cliente.tipo}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`pill ${COLOR_ESTADO[cliente.estado]}`}>{cliente.estado}</span>
            {/* Lista desplegable, sin texto libre (SYS-US-004) */}
            <select
              className="month-select"
              value={cliente.estado}
              onChange={cambiarEstado}
              aria-label="Cambiar estado del cliente"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Potencial">Potencial</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {/* SYS-FR-020: ver la ubicación del cliente en el mapa (necesita internet) */}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setVerMapa(true)}
            disabled={!enLinea}
            title={enLinea ? 'Ver la ubicación del cliente' : 'El mapa necesita internet'}
          >
            <MapaIcono size={15} /> Ver mapa
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setEditando(true)}>
            <Pencil size={15} /> Editar
          </button>
        </div>
      </div>

      {/* ----- PESTAÑAS ----- */}
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
            {p}
          </button>
        ))}
      </div>

      {/* ===== RESUMEN ===== */}
      {pestana === 'Resumen' && (
        <div className="grid-2">
          <div className="card">
            <h3>Datos comerciales</h3>
            <div className="timeline-item"><div className="ti-dot"></div><div>
              <div className="ti-title">Zona</div><div className="ti-date">{cliente.zona}</div>
            </div></div>
            <div className="timeline-item"><div className="ti-dot"></div><div>
              <div className="ti-title">Última visita</div><div className="ti-date">{cliente.ultimaVisita || 'Sin visitas registradas'}</div>
            </div></div>
            {/* SYS-FR-011: tipo de cultivo y productos de interés */}
            <div className="timeline-item"><div className="ti-dot"></div><div>
              <div className="ti-title"><Sprout size={13} style={{ verticalAlign: 'middle' }} /> Tipo de cultivo</div>
              <div className="ti-date">{cliente.cultivo || 'Sin registrar'}</div>
            </div></div>
            <div className="section-label" style={{ marginTop: 14 }}>Productos de interés</div>
            <div className="chip-row">
              {(cliente.productosInteres ?? []).length === 0 && <p>Sin productos registrados.</p>}
              {(cliente.productosInteres ?? []).map((p) => <span className="pill pill-verde" key={p}>{p}</span>)}
            </div>
          </div>

          <div className="card">
            <h3>Resumen de actividad</h3>
            <div className="stat-grid">
              <div className="stat-card"><strong>{susVisitas.length}</strong><span>Visitas</span></div>
              <div className="stat-card"><strong>{susVentas.length}</strong><span>Ventas</span></div>
              <div className="stat-card"><strong>{susCompromisos.length}</strong><span>Compromisos</span></div>
            </div>
            <p style={{ marginTop: 14 }}>Total comprado: <strong>{formatoPesos(totalCompras)}</strong></p>
          </div>
        </div>
      )}

      {/* ===== VISITAS (SYS-FR-031: historial cronológico) ===== */}
      {pestana === 'Visitas' && (
        <div className="card">
          <h3>Historial de visitas</h3>
          <HistorialCliente visitas={susVisitas} />
        </div>
      )}

      {/* ===== COMPRAS (SYS-FR-052) ===== */}
      {pestana === 'Compras' && (
        <div className="card">
          <h3>Historial de compras</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Fecha</th><th>Producto</th><th>Cantidad</th><th>Valor total</th></tr>
              </thead>
              <tbody>
                {susVentas.length === 0 && (
                  <tr><td colSpan={4}>Este cliente aún no tiene ventas registradas.</td></tr>
                )}
                {susVentas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.fecha}</td>
                    <td>{v.producto ?? '—'}</td>
                    <td>{v.cantidad ?? '—'}</td>
                    {/* SYS-FR-047: sin precio no se calcula el valor */}
                    <td>{v.valorTotal == null ? <span className="pill pill-gris">Sin precio</span> : formatoPesos(v.valorTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== COMPROMISOS (SYS-FR-041 y 042) ===== */}
      {pestana === 'Compromisos' && (
        <>
          <ResumenCumplimiento compromisos={susCompromisos} />
          <div className="card">
            <h3>Compromisos del cliente</h3>
            {susCompromisos.length === 0 && <p>Este cliente no tiene compromisos.</p>}
            {/* Los incumplidos también se muestran: quedan en el historial (SYS-FR-042) */}
            {susCompromisos.map((c) => (
              <div className="visit-card" key={c.id}>
                <div className="vc-info">
                  <div className="vc-name">{c.tipo}</div>
                  <div className="vc-meta">{c.descripcion} · {c.fecha}</div>
                </div>
                <span className={`pill ${COLOR_COMPROMISO[c.estado]}`}>{c.estado}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== DOCUMENTOS (SYS-FR-014 a 019) ===== */}
      {pestana === 'Documentos' && (
        <div className="card">
          <h3>Documentos del cliente</h3>
          <DocumentosCliente
            documentos={cliente.documentos}
            onCambiar={(documentos) => setCliente({ ...cliente, documentos })}
            nombreCliente={cliente.nombre}
          />
        </div>
      )}

      {/* ----- VENTANA DEL MAPA ----- */}
      {verMapa && (
        <Modal titulo={`Ubicación · ${cliente.nombre}`} onCerrar={() => setVerMapa(false)} tamano="lg">
          <AvisoSinConexion>El mapa necesita internet.</AvisoSinConexion>
          <MapaCliente cliente={cliente} />
        </Modal>
      )}

      {/* ----- VENTANA DE EDICIÓN ----- */}
      {editando && (
        <Modal titulo="Editar cliente" onCerrar={() => setEditando(false)}>
          <FormularioCliente cliente={cliente} onGuardar={guardarEdicion} onCancelar={() => setEditando(false)} />
        </Modal>
      )}
    </>
  );
}