// DatosContext: las ventas y las oportunidades, COMPARTIDAS entre todas las pantallas.
//
// ¿Por qué existe? Antes cada página guardaba su propia copia de la lista. Así, una venta
// registrada en "Ventas" no aparecía en el Panel ni en los Reportes, y una oportunidad no
// podía convertirse en venta. Ahora todas leen y escriben aquí.
//
// useDatos() devuelve:
//   ventas, oportunidades                  las listas actuales
//   registrarVenta(datos)                  venta directa (sin oportunidad) → devuelve la venta creada
//   agregarOportunidad(datos)              crea una oportunidad en estado 'Nueva'
//   cambiarEstadoOportunidad(id, estado)   avanzar, pausar o reabrir (no sirve para 'Convertida')
//   cerrarVenta(oportunidadId, datos)      CIERRA LA VENTA: registra la venta y pasa la
//                                          oportunidad a 'Convertida' en un solo paso
//
// Los datos de ejemplo vienen de src/data/. Viven en memoria: al recargar la página vuelven
// a los de ejemplo (igual que antes). TODO: guardar en el servidor cuando exista el backend.

import { useCallback, useMemo, useState } from 'react';
import { productos } from '../data/productos.js';
import { ventas as ventasIniciales } from '../data/ventas.js';
import { oportunidades as oportunidadesIniciales } from '../data/oportunidades.js';
import { DatosContext } from './contextos.js';

const hoyISO = () => new Date().toLocaleDateString('en-CA');

// Arma una venta guardando el precio y el valor USADOS EN ESTE MOMENTO (decisión 10.2):
// valor = cantidad × precio. Si no hay precio, valorTotal queda en null ("Sin precio").
function construirVenta({ clienteId, productoId, cantidad, precioUnitario, fecha, oportunidadId }) {
  const producto = productos.find((p) => String(p.id) === String(productoId));
  const cantidadNumero = Number(cantidad);
  const precio = precioUnitario ?? null;

  return {
    id: 'V' + Date.now(),
    clienteId,
    productoId,
    producto: producto?.nombre ?? '—',
    cantidad: cantidadNumero,
    precioUnitario: precio,
    valorTotal: precio == null ? null : cantidadNumero * precio,
    fecha,
    ...(oportunidadId ? { oportunidadId } : {}),
  };
}

export function DatosProvider({ children }) {
  const [ventas, setVentas] = useState(ventasIniciales);
  const [oportunidades, setOportunidades] = useState(oportunidadesIniciales);

  const registrarVenta = useCallback((datos) => {
    const venta = construirVenta(datos);
    setVentas((prev) => [venta, ...prev]);
    return venta;
  }, []);

  const agregarOportunidad = useCallback((datos) => {
    const nueva = { ...datos, id: 'O' + Date.now(), estado: 'Nueva', fecha: hoyISO() };
    setOportunidades((prev) => [nueva, ...prev]);
    return nueva;
  }, []);

  const cambiarEstadoOportunidad = useCallback((id, estado) => {
    setOportunidades((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)));
  }, []);

  const cerrarVenta = useCallback((oportunidadId, datos) => {
    const venta = construirVenta({ ...datos, oportunidadId });
    setVentas((prev) => [venta, ...prev]);
    setOportunidades((prev) =>
      prev.map((o) => (o.id === oportunidadId ? { ...o, estado: 'Convertida', ventaId: venta.id } : o)),
    );
    return venta;
  }, []);

  const valor = useMemo(
    () => ({ ventas, oportunidades, registrarVenta, agregarOportunidad, cambiarEstadoOportunidad, cerrarVenta }),
    [ventas, oportunidades, registrarVenta, agregarOportunidad, cambiarEstadoOportunidad, cerrarVenta],
  );

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}
