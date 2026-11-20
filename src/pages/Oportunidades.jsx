// Oportunidades: ventas que el RTC espera cerrar (M4 · SYS-FR-034 a 037 y 043).
//   - Crear una oportunidad con cliente, producto del catálogo y cantidad.  (SYS-FR-034)
//   - Avanzarla por las etapas según el resultado del contacto.             (SYS-FR-035)
//   - CERRAR LA VENTA, dejarla en pausa o marcarla "sin intención".         (SYS-FR-036)
//   - Todas las abiertas en un solo panel.                                  (SYS-FR-037)
//   - Las cantidades proyectadas NO son ventas efectivas.                   (SYS-FR-043)
//
// PROCESO DE LA VENTA (lo explica el bloque de pasos de arriba):
//   Nueva → En contacto → En negociación → [Cerrar venta] → Convertida
//   "Cerrar venta" abre un formulario con la cantidad y el precio REALES; al guardarlo se
//   registra la venta en Ventas y la oportunidad pasa sola a "Convertida". Por eso la lista de
//   estados ya no permite elegir "Convertida" a mano: una oportunidad convertida sin venta
//   dejaría los reportes inconsistentes.
//
// FORMA DE LOS DATOS:
//   oportunidades: { id, clienteId, productoId, cantidad, estado, fecha, ventaId? }
//   productos:     { id, nombre, unidad, precio? }
// Las oportunidades y las ventas viven en DatosContext (useDatos), compartidas con las demás pantallas.
//
// COMPONENTES:
//   <FormularioOportunidad onGuardar onCancelar />   onGuardar recibe { clienteId, productoId, cantidad }
//   <FormularioVenta inicial bloquear textoGuardar onGuardar onCancelar />   (se reutiliza para cerrar la venta)

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, CheckCircle2, Eye } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { useDatos } from '../hooks/useDatos.js';
import { clientes } from '../data/clientes.js';
import { productos } from '../data/productos.js';
import Modal from '../components/ui/Modal.jsx';
import FormularioOportunidad from '../components/oportunidades/FormularioOportunidad.jsx';
import FormularioVenta from '../components/ventas/FormularioVenta.jsx';
import ProcesoVenta from '../components/oportunidades/ProcesoVenta.jsx';

// Etapas por las que avanza una oportunidad abierta (en este orden)
const ESTADOS_ABIERTOS = ['Nueva', 'En contacto', 'En negociación'];
// Resultados que cierran la oportunidad SIN venta (se pueden reabrir)
const OTROS_RESULTADOS = ['En pausa', 'Sin intención por ahora'];
const ESTADOS_CERRADOS = ['Convertida', ...OTROS_RESULTADOS];

const COLOR_CERRADA = {
  'Convertida': 'pill-verde',
  'En pausa': 'pill-amarillo',
  'Sin intención por ahora': 'pill-gris',
};

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

export default function Oportunidades() {
  const mostrarToast = useToast();
  const {
    oportunidades: lista,
    agregarOportunidad,
    cambiarEstadoOportunidad,
    cerrarVenta,
  } = useDatos();

  const [pestana, setPestana] = useState('Abiertas');
  const [verFormulario, setVerFormulario] = useState(false);
  const [aCerrar, setACerrar] = useState(null);   // la oportunidad cuya venta se está cerrando

  const cliente = (id) => clientes.find((c) => c.id === id);
  const producto = (id) => productos.find((p) => p.id === id);

  const abiertas = lista.filter((o) => ESTADOS_ABIERTOS.includes(o.estado));
  const cerradas = lista.filter((o) => ESTADOS_CERRADOS.includes(o.estado));
  const convertidas = lista.filter((o) => o.estado === 'Convertida').length;

  // Cuántas oportunidades abiertas hay en cada etapa (para el bloque de pasos)
  const conteos = Object.fromEntries(
    ESTADOS_ABIERTOS.map((e) => [e, abiertas.filter((o) => o.estado === e).length]),
  );

  // SYS-FR-035 y 036: avanzar, pausar o reabrir (nunca "Convertida": eso es "Cerrar venta")
  const cambiarEstado = (id, estado) => {
    cambiarEstadoOportunidad(id, estado);
    mostrarToast(
      ESTADOS_ABIERTOS.includes(estado)
        ? `La oportunidad pasó a «${estado}»`
        : `La oportunidad quedó en «${estado}»`,
    );
  };

  // Lo llama FormularioVenta al cerrar la venta: registra la venta Y convierte la oportunidad
  const confirmarCierre = (datos) => {
    const venta = cerrarVenta(aCerrar.id, datos);
    setACerrar(null);
    mostrarToast(
      venta.valorTotal == null
        ? 'Venta cerrada sin valor (el producto no tiene precio). La oportunidad pasó a Convertida.'
        : `Venta cerrada por ${formatoPesos(venta.valorTotal)}. La oportunidad pasó a Convertida.`,
    );
  };

  // SYS-FR-034: lo llama FormularioOportunidad
  const guardar = (datos) => {
    agregarOportunidad(datos);
    setVerFormulario(false);
    mostrarToast('Oportunidad registrada correctamente');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Oportunidades</h2>
          <div className="subtitle">{abiertas.length} abiertas · {convertidas} convertidas</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setVerFormulario(true)}>
          <Plus size={16} /> Nueva oportunidad
        </button>
      </div>

      {/* El proceso de la venta, de un vistazo */}
      <ProcesoVenta conteos={conteos} cerradas={convertidas} />

      {/* SYS-FR-043: se deja claro que lo proyectado no es venta */}
      <div className="banner-warn">
        Las cantidades de esta sección son <strong>proyecciones</strong>. Una oportunidad se vuelve
        venta solo cuando pulsas <strong>«Cerrar venta»</strong> y confirmas la cantidad y el precio reales.
      </div>

      <div className="tabs" role="tablist">
        {['Abiertas', 'Cerradas'].map((p) => (
          <button
            key={p}
            type="button"
            role="tab"
            aria-selected={pestana === p}
            className={`tab-btn ${pestana === p ? 'active' : ''}`}
            onClick={() => setPestana(p)}
          >
            {p}<span className="count">{p === 'Abiertas' ? abiertas.length : cerradas.length}</span>
          </button>
        ))}
      </div>

      {/* ===== PANEL DE OPORTUNIDADES ABIERTAS (SYS-FR-037) ===== */}
      {pestana === 'Abiertas' && (
        <div className="kanban-wrap kanban-3">
          {ESTADOS_ABIERTOS.map((estado, i) => {
            const columna = abiertas.filter((o) => o.estado === estado);
            const siguiente = ESTADOS_ABIERTOS[i + 1];   // undefined en la última etapa
            return (
              <div className="kanban-col" key={estado}>
                <div className="kc-head">
                  <span>{i + 1}. {estado}</span>
                  <span className="kc-count">{columna.length}</span>
                </div>
                {columna.length === 0 && <p className="vc-meta">Sin oportunidades en esta etapa.</p>}
                {columna.map((o) => (
                  <div className="kanban-card" key={o.id}>
                    <div className="kc-name">{cliente(o.clienteId)?.nombre ?? 'Cliente'}</div>
                    <div className="kc-title">
                      {producto(o.productoId)?.nombre ?? 'Producto'} · {o.cantidad} {producto(o.productoId)?.unidad ?? ''}
                    </div>
                    <div className="kc-foot">
                      <span className="pill pill-gris">Proyectado</span>
                    </div>

                    <div className="kc-acciones">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setACerrar(o)}>
                        <CheckCircle2 size={14} /> Cerrar venta
                      </button>
                      {siguiente && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => cambiarEstado(o.id, siguiente)}>
                          Pasar a «{siguiente}» <ArrowRight size={14} />
                        </button>
                      )}
                      <select
                        className="month-select"
                        value=""
                        onChange={(e) => e.target.value && cambiarEstado(o.id, e.target.value)}
                        aria-label={`Otro resultado para la oportunidad de ${cliente(o.clienteId)?.nombre}`}
                      >
                        <option value="">Otro resultado…</option>
                        {OTROS_RESULTADOS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* ===== OPORTUNIDADES CERRADAS ===== */}
      {pestana === 'Cerradas' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Cliente</th><th>Producto</th><th>Cantidad</th><th>Fecha</th><th>Resultado</th><th>Acción</th></tr>
              </thead>
              <tbody>
                {cerradas.length === 0 && <tr><td colSpan={6}>Todavía no hay oportunidades cerradas.</td></tr>}
                {cerradas.map((o) => (
                  <tr key={o.id}>
                    <td>{cliente(o.clienteId)?.nombre ?? 'Cliente'}</td>
                    <td>{producto(o.productoId)?.nombre ?? 'Producto'}</td>
                    <td>{o.cantidad} {producto(o.productoId)?.unidad ?? ''}</td>
                    <td>{o.fecha}</td>
                    <td><span className={`pill ${COLOR_CERRADA[o.estado]}`}>{o.estado}</span></td>
                    <td>
                      {o.estado === 'Convertida' ? (
                        // Ya tiene su venta registrada: se consulta en Ventas
                        <Link to="/ventas" className="btn btn-outline btn-sm"><Eye size={14} /> Ver venta</Link>
                      ) : (
                        // En pausa o sin intención: se puede reabrir o cambiar el motivo
                        <select
                          className="month-select"
                          value={o.estado}
                          onChange={(e) => cambiarEstado(o.id, e.target.value)}
                          aria-label={`Cambiar estado de la oportunidad de ${cliente(o.clienteId)?.nombre}`}
                        >
                          {[...ESTADOS_ABIERTOS, ...OTROS_RESULTADOS].map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {verFormulario && (
        <Modal titulo="Nueva oportunidad" onCerrar={() => setVerFormulario(false)}>
          <FormularioOportunidad onGuardar={guardar} onCancelar={() => setVerFormulario(false)} />
        </Modal>
      )}

      {/* ===== CERRAR VENTA: confirma lo realmente vendido ===== */}
      {aCerrar && (
        <Modal titulo="Cerrar venta" onCerrar={() => setACerrar(null)}>
          <p className="vc-meta" style={{ marginBottom: 14 }}>
            Confirma lo que realmente se vendió. Se registrará en <strong>Ventas</strong> y la
            oportunidad pasará a <strong>Convertida</strong>. El precio se toma del catálogo,
            pero puedes cambiarlo para esta venta.
          </p>
          <FormularioVenta
            inicial={{ clienteId: aCerrar.clienteId, productoId: aCerrar.productoId, cantidad: aCerrar.cantidad }}
            bloquear
            textoGuardar="Cerrar venta"
            onGuardar={confirmarCierre}
            onCancelar={() => setACerrar(null)}
          />
        </Modal>
      )}
    </>
  );
}
