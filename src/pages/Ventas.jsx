// Ventas: registro y consulta de las ventas del RTC (M5).
//   - Registrar una venta con cliente, producto del catálogo, cantidad y fecha.
//   - Valor de la venta = cantidad × precio unitario (decisión 10.2).
//   - Cada venta guarda el precio y el valor usados en ese momento, así que un
//     cambio posterior de precio en el catálogo no la modifica.
//   - Si el producto no tiene precio, la venta se guarda con valorTotal = null
//     y se muestra "Sin precio" (SYS-FR-047).
//   - Aquí se registran las ventas DIRECTAS. Las que vienen de una oportunidad se crean
//     con el botón "Cerrar venta" de la página Oportunidades y se marcan con "Oportunidad".
//
// FORMA DE LOS DATOS:
//   ventas:    { id, clienteId, productoId?, producto?, cantidad?, precioUnitario?, fecha, valorTotal, oportunidadId? }
//   productos: { id, nombre, unidad, precio? }
//
// COMPONENTE: <FormularioVenta onGuardar onCancelar />
//   onGuardar recibe { clienteId, productoId, cantidad, precioUnitario, fecha }
//   (precioUnitario es un número, o null si no hay precio)

import { useState } from 'react';
import { Plus, DollarSign, Receipt, CircleOff } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { useDatos } from '../hooks/useDatos.js';
import { clientes } from '../data/clientes.js';
import { formatoFecha } from '../utils/fechas.js';
import Modal from '../components/ui/Modal.jsx';
import FormularioVenta from '../components/ventas/FormularioVenta.jsx';

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

export default function Ventas() {
  const mostrarToast = useToast();
  const hoy = new Date().toLocaleDateString('en-CA');
  const mesActual = hoy.slice(0, 7);   // 'AAAA-MM'

  const { ventas: lista, registrarVenta } = useDatos();
  const [filtroCliente, setFiltroCliente] = useState('');
  const [verFormulario, setVerFormulario] = useState(false);

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';

  // ----- CIFRAS -----
  const ventasMes = lista.filter((v) => v.fecha.startsWith(mesActual));
  const totalMes = ventasMes.reduce((suma, v) => suma + (v.valorTotal || 0), 0);
  const ventasSinPrecio = lista.filter((v) => v.valorTotal == null).length;

  // ----- LISTA FILTRADA Y ORDENADA (las más recientes primero) -----
  const visibles = lista
    .filter((v) => filtroCliente === '' || String(v.clienteId) === filtroCliente)
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Lo llama FormularioVenta al guardar (la venta se arma y se guarda en DatosContext)
  const guardar = (datos) => {
    const nueva = registrarVenta(datos);
    setVerFormulario(false);
    mostrarToast(
      nueva.valorTotal == null
        ? 'Venta registrada sin valor (el producto no tiene precio)'
        : 'Venta registrada correctamente',
    );
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Ventas</h2>
          <div className="subtitle">{lista.length} ventas registradas</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setVerFormulario(true)}>
          <Plus size={16} /> Registrar venta
        </button>
      </div>

      {/* ----- CIFRAS ----- */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label"><DollarSign size={14} /> Ventas del mes</div>
          <div className="kpi-value">{formatoPesos(totalMes)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><Receipt size={14} /> Ventas registradas este mes</div>
          <div className="kpi-value">{ventasMes.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label"><CircleOff size={14} /> Ventas sin precio</div>
          <div className="kpi-value">{ventasSinPrecio}</div>
        </div>
      </div>

      {/* ----- FILTRO ----- */}
      <div className="toolbar">
        <div className="toolbar-left">
          <select
            className="month-select"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            aria-label="Filtrar ventas por cliente"
          >
            <option value="">Todos los clientes</option>
            {clientes.map((c) => <option key={c.id} value={String(c.id)}>{c.nombre}</option>)}
          </select>
        </div>
      </div>

      {/* ----- TABLA ----- */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Valor total</th>
                <th>Origen</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr><td colSpan={7}>No hay ventas para mostrar.</td></tr>
              )}
              {visibles.map((v) => (
                <tr key={v.id}>
                  <td>{formatoFecha(v.fecha)}</td>
                  <td>{nombreCliente(v.clienteId)}</td>
                  <td>{v.producto ?? '—'}</td>
                  <td>{v.cantidad ?? '—'}</td>
                  <td>{v.precioUnitario == null ? '—' : formatoPesos(v.precioUnitario)}</td>
                  <td>
                    {v.valorTotal == null
                      ? <span className="pill pill-gris">Sin precio</span>
                      : formatoPesos(v.valorTotal)}
                  </td>
                  <td>
                    {v.oportunidadId
                      ? <span className="pill pill-verde">Oportunidad</span>
                      : <span className="pill pill-gris">Directa</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {verFormulario && (
        <Modal titulo="Registrar venta" onCerrar={() => setVerFormulario(false)}>
          <FormularioVenta onGuardar={guardar} onCancelar={() => setVerFormulario(false)} />
        </Modal>
      )}
    </>
  );
}