// FormularioVenta: formulario para registrar una venta (se abre dentro de un Modal).
//   - Al elegir el producto, el precio se rellena con el del catálogo,
//     pero el RTC puede cambiarlo para esta venta.
//   - Valor de la venta = cantidad × precio unitario.
//   - Si no hay precio, la venta se guarda sin valor (SYS-FR-047).
//
// onGuardar recibe { clienteId, productoId, cantidad, precioUnitario, fecha }
//   precioUnitario: número, o null si se dejó vacío.
//
// PROPS OPCIONALES (para CERRAR UNA VENTA desde una oportunidad):
//   inicial:       { clienteId, productoId, cantidad } con lo que ya se sabe de la oportunidad
//   bloquear:      true = el cliente y el producto no se pueden cambiar
//   textoGuardar:  texto del botón (por defecto 'Guardar venta')

import { useState } from 'react';
import { clientes } from '../../data/clientes.js';
import { productos } from '../../data/productos.js';

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

export default function FormularioVenta({ onGuardar, onCancelar, inicial = null, bloquear = false, textoGuardar = 'Guardar venta' }) {
  const hoy = new Date().toLocaleDateString('en-CA');

  const [datos, setDatos] = useState(() => {
    const producto = productos.find((p) => String(p.id) === String(inicial?.productoId));
    return {
      clienteId: inicial?.clienteId != null ? String(inicial.clienteId) : '',
      productoId: inicial?.productoId != null ? String(inicial.productoId) : '',
      cantidad: inicial?.cantidad != null ? String(inicial.cantidad) : '',
      // El precio se trae del catálogo (si lo tiene), pero el RTC puede cambiarlo
      precioUnitario: producto?.precio == null ? '' : String(producto.precio),
      fecha: hoy,
    };
  });
  const [error, setError] = useState('');

  const cambiarCampo = (campo) => (e) => setDatos({ ...datos, [campo]: e.target.value });

  // Al elegir producto se trae su precio del catálogo (si lo tiene)
  const cambiarProducto = (e) => {
    const id = e.target.value;
    const producto = productos.find((p) => String(p.id) === id);
    setDatos({
      ...datos,
      productoId: id,
      precioUnitario: producto?.precio == null ? '' : String(producto.precio),
    });
  };

  const productoElegido = productos.find((p) => String(p.id) === datos.productoId);
  const cantidad = Number(datos.cantidad);
  const precio = datos.precioUnitario === '' ? null : Number(datos.precioUnitario);
  const valorPrevio = precio !== null && cantidad > 0 ? cantidad * precio : null;

  const enviar = (e) => {
    e.preventDefault();

    if (!datos.clienteId || !datos.productoId) {
      setError('Elige el cliente y el producto.');
      return;
    }
    if (Number.isNaN(cantidad) || cantidad <= 0) {
      setError('La cantidad debe ser un número mayor a 0.');
      return;
    }
    if (precio !== null && (Number.isNaN(precio) || precio < 0)) {
      setError('El precio debe ser un número mayor o igual a 0.');
      return;
    }
    if (!datos.fecha || datos.fecha > hoy) {
      setError('La fecha de la venta no puede ser futura.');
      return;
    }

    setError('');
    onGuardar({
      clienteId: datos.clienteId,
      productoId: datos.productoId,
      cantidad,
      precioUnitario: precio,
      fecha: datos.fecha,
    });
  };

  return (
    <form onSubmit={enviar}>
      {error && <div className="banner-warn" role="alert">{error}</div>}

      <div className="form-grid">
        <div className="fld">
          <label htmlFor="ven-cliente">Cliente *</label>
          <select id="ven-cliente" value={datos.clienteId} onChange={cambiarCampo('clienteId')} disabled={bloquear} required>
            <option value="">Selecciona…</option>
            {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="fld">
          <label htmlFor="ven-producto">Producto *</label>
          <select id="ven-producto" value={datos.productoId} onChange={cambiarProducto} disabled={bloquear} required>
            <option value="">Selecciona…</option>
            {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div className="fld">
          <label htmlFor="ven-cantidad">
            Cantidad{productoElegido?.unidad ? ` (${productoElegido.unidad})` : ''} *
          </label>
          <input
            id="ven-cantidad"
            type="number"
            min="0"
            step="any"
            value={datos.cantidad}
            onChange={cambiarCampo('cantidad')}
            required
          />
        </div>

        <div className="fld">
          <label htmlFor="ven-precio">Precio unitario</label>
          <input
            id="ven-precio"
            type="number"
            min="0"
            step="any"
            value={datos.precioUnitario}
            onChange={cambiarCampo('precioUnitario')}
            placeholder="Sin precio"
          />
        </div>

        <div className="fld">
          <label htmlFor="ven-fecha">Fecha *</label>
          <input
            id="ven-fecha"
            type="date"
            max={hoy}
            value={datos.fecha}
            onChange={cambiarCampo('fecha')}
            required
          />
        </div>
      </div>

      {/* Vista previa del valor: cantidad × precio unitario */}
      <p className="vc-meta" style={{ marginTop: 10 }}>
        {valorPrevio === null
          ? 'Sin precio: la venta se guardará sin valor total.'
          : `Valor total: ${formatoPesos(valorPrevio)}`}
      </p>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{textoGuardar}</button>
      </div>
    </form>
  );
}