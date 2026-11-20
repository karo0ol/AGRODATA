// Compromisos: lo pactado con los clientes (M4 · SYS-FR-038 a 042).
//   - Registrar compromisos con tipo, cliente, producto, descripción y estado. (SYS-FR-038)
//   - Asociarles una actividad de seguimiento.                               (SYS-FR-039)
//   - Avisar 1 día antes de la fecha del compromiso.                         (SYS-FR-040)
//   - Mostrar el porcentaje de cumplimiento.                                 (SYS-FR-041)
//   - Conservar los incumplidos en el historial del cliente.                 (SYS-FR-042)
//
// FORMA DE LOS DATOS:
//   compromisos: { id, clienteId, productoId?, tipo, descripcion, observaciones?,
//                  fecha, estado: 'Pendiente' | 'Cumplido' | 'Incumplido', seguimientoFecha? }
//
// COMPONENTES:
//   <FormularioCompromiso onGuardar onCancelar />
//        onGuardar recibe { clienteId, productoId, tipo, descripcion, observaciones,
//                           fecha, seguimientoFecha? }
//   <ResumenCumplimiento compromisos />   (calcula cumplidos ÷ pactados × 100)

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { clientes } from '../data/clientes.js';
import { productos } from '../data/productos.js';
import { compromisos as compromisosIniciales } from '../data/compromisos.js';
import { sumarDias, formatoFecha } from '../utils/fechas.js';
import Modal from '../components/ui/Modal.jsx';
import FormularioCompromiso from '../components/compromisos/FormularioCompromiso.jsx';
import ResumenCumplimiento from '../components/compromisos/ResumenCumplimiento.jsx';

const FILTROS = ['Todos', 'Pendiente', 'Cumplido', 'Incumplido'];
const COLOR_ESTADO = { Pendiente: 'pill-amarillo', Cumplido: 'pill-verde', Incumplido: 'pill-rojo' };
const DIAS_AVISO = 1;   // SYS-FR-040

export default function Compromisos() {
  const mostrarToast = useToast();
  const hoy = new Date().toLocaleDateString('en-CA');
  const fechaAviso = sumarDias(hoy, DIAS_AVISO);

  const [lista, setLista] = useState(compromisosIniciales);
  const [filtro, setFiltro] = useState('Todos');
  const [verFormulario, setVerFormulario] = useState(false);

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';
  const nombreProducto = (id) => productos.find((p) => p.id === id)?.nombre;

  const cuenta = (estado) => lista.filter((c) => c.estado === estado).length;
  const visibles = (filtro === 'Todos' ? lista : lista.filter((c) => c.estado === filtro))
    .slice()
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  // SYS-FR-038 y 039: lo llama FormularioCompromiso
  const guardar = (datos) => {
    const nuevo = { ...datos, id: 'K' + Date.now(), estado: 'Pendiente' };
    setLista([nuevo, ...lista]);
    setVerFormulario(false);
    mostrarToast(
      datos.seguimientoFecha
        ? 'Compromiso registrado y seguimiento programado'
        : 'Compromiso registrado correctamente',
    );
  };

  // Cambia el estado. Los incumplidos NO se borran: quedan en el historial (SYS-FR-042)
  const cambiarEstado = (id, estado) => {
    setLista(lista.map((c) => (c.id === id ? { ...c, estado } : c)));
    mostrarToast(`Compromiso marcado como ${estado.toLowerCase()}`);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Compromisos</h2>
          <div className="subtitle">{cuenta('Pendiente')} pendientes</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setVerFormulario(true)}>
          <Plus size={16} /> Nuevo compromiso
        </button>
      </div>

      {/* SYS-FR-041: porcentaje de cumplimiento */}
      <ResumenCumplimiento compromisos={lista} />

      <div className="tabs" role="tablist">
        {FILTROS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filtro === f}
            className={`tab-btn ${filtro === f ? 'active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f}<span className="count">{f === 'Todos' ? lista.length : cuenta(f)}</span>
          </button>
        ))}
      </div>

      <div className="card">
        {visibles.length === 0 && <p>No hay compromisos con este estado.</p>}

        {visibles.map((c) => {
          const venceManana = c.estado === 'Pendiente' && c.fecha === fechaAviso;     // SYS-FR-040
          const vencido = c.estado === 'Pendiente' && c.fecha < hoy;
          return (
            <div className="visit-card" key={c.id}>
              <div className="vc-info">
                <div className="vc-name">
                  {nombreCliente(c.clienteId)} · {c.tipo}
                </div>
                <div className="vc-meta">
                  {c.descripcion}
                  {nombreProducto(c.productoId) ? ` · ${nombreProducto(c.productoId)}` : ''}
                  {' · '}Para el {formatoFecha(c.fecha)}
                  {c.seguimientoFecha ? ` · Seguimiento el ${formatoFecha(c.seguimientoFecha)}` : ''}
                </div>
                {c.observaciones && <div className="vc-meta">Obs.: {c.observaciones}</div>}
              </div>

              <div className="vc-actions">
                {venceManana && <span className="pill pill-amarillo">Vence mañana</span>}
                {vencido && <span className="pill pill-rojo">Fecha vencida</span>}
                <span className={`pill ${COLOR_ESTADO[c.estado]}`}>{c.estado}</span>

                {c.estado === 'Pendiente' ? (
                  <>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => cambiarEstado(c.id, 'Cumplido')}>
                      Cumplido
                    </button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => cambiarEstado(c.id, 'Incumplido')}>
                      Incumplido
                    </button>
                  </>
                ) : (
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => cambiarEstado(c.id, 'Pendiente')}>
                    Reabrir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {verFormulario && (
        <Modal titulo="Nuevo compromiso" onCerrar={() => setVerFormulario(false)}>
          <FormularioCompromiso onGuardar={guardar} onCancelar={() => setVerFormulario(false)} />
        </Modal>
      )}
    </>
  );
}