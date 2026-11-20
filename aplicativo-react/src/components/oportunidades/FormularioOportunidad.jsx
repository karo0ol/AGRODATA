// FormularioOportunidad: registrar una oportunidad de venta (M4 · SYS-FR-034).
//   - Cliente y producto se eligen de listas, sin texto libre.
//   - Las cantidades son una PROYECCIÓN, no una venta (SYS-FR-043).
//
// PROPS:
//   onGuardar:  recibe { clienteId, productoId, cantidad }
//   onCancelar: cierra sin guardar
// La página agrega el estado ('Nueva') y la fecha al guardar.

import { useState } from 'react';
import { clientes } from '../../data/clientes.js';
import { productos } from '../../data/productos.js';
import CampoTexto from '../ui/CampoTexto.jsx';
import CampoSelect from '../ui/CampoSelect.jsx';
import Boton from '../ui/Boton.jsx';
import Mensaje from '../ui/Mensaje.jsx';

const OPCIONES_CLIENTE = [...clientes]
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  .map((c) => ({ valor: String(c.id), texto: c.nombre }));

const OPCIONES_PRODUCTO = productos.map((p) => ({
  valor: String(p.id),
  texto: `${p.nombre} (${p.unidad})`,
}));

export default function FormularioOportunidad({ onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({ clienteId: '', productoId: '', cantidad: '' });
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (valor) => setDatos((d) => ({ ...d, [campo]: valor }));

  const productoElegido = productos.find((p) => String(p.id) === datos.productoId);

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = {};
    const cantidad = Number(datos.cantidad);

    if (!datos.clienteId) nuevos.clienteId = 'Elige el cliente.';
    if (!datos.productoId) nuevos.productoId = 'Elige el producto.';
    if (datos.cantidad === '' || Number.isNaN(cantidad) || cantidad <= 0) {
      nuevos.cantidad = 'La cantidad debe ser un número mayor a 0.';
    }

    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    // Se devuelven los ids con su tipo original, no el texto del <select>
    const cliente = clientes.find((c) => String(c.id) === datos.clienteId);
    const producto = productos.find((p) => String(p.id) === datos.productoId);
    onGuardar({ clienteId: cliente.id, productoId: producto.id, cantidad });
  };

  return (
    <form onSubmit={enviar} noValidate>
      {Object.keys(errores).length > 0 && (
        <Mensaje tipo="error">Revisa los campos marcados en rojo.</Mensaje>
      )}

      <div className="form-grid">
        <CampoSelect
          etiqueta="Cliente"
          valor={datos.clienteId}
          onChange={cambiar('clienteId')}
          opciones={OPCIONES_CLIENTE}
          error={errores.clienteId}
          requerido
        />
        <CampoSelect
          etiqueta="Producto"
          valor={datos.productoId}
          onChange={cambiar('productoId')}
          opciones={OPCIONES_PRODUCTO}
          error={errores.productoId}
          requerido
        />
        <CampoTexto
          etiqueta={`Cantidad proyectada${productoElegido ? ` (${productoElegido.unidad})` : ''}`}
          tipo="number"
          valor={datos.cantidad}
          onChange={cambiar('cantidad')}
          min="1"
          error={errores.cantidad}
          requerido
        />
      </div>

      <div className="form-actions">
        <Boton variante="contorno" onClick={onCancelar}>Cancelar</Boton>
        <Boton type="submit">Guardar oportunidad</Boton>
      </div>
    </form>
  );
}
