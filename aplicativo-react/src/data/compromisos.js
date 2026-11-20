// Compromisos de ejemplo (datos inventados).
// estado: 'Pendiente' | 'Cumplido' | 'Incumplido'. seguimientoFecha es opcional.
export const compromisos = [
  { id: 'K1', clienteId: 'C2', productoId: 'P2', tipo: 'Envío de cotización', descripcion: 'Enviar cotización de urea con descuento por volumen', fecha: '2026-11-18', estado: 'Pendiente', seguimientoFecha: '2026-11-24' },
  { id: 'K2', clienteId: 'C1', productoId: 'P1', tipo: 'Entrega de producto', descripcion: 'Entregar pedido de fertilizante', fecha: '2026-11-10', estado: 'Cumplido' },
  { id: 'K3', clienteId: 'C3', tipo: 'Visita pactada', descripcion: 'Llamar para confirmar la decisión del administrador', fecha: '2026-11-14', estado: 'Incumplido', observaciones: 'No se pudo contactar.' },
  { id: 'K4', clienteId: 'C4', productoId: 'P3', tipo: 'Muestra o demostración', descripcion: 'Llevar muestra de fungicida', fecha: '2026-11-20', estado: 'Pendiente' },
  { id: 'K5', clienteId: 'C7', tipo: 'Pago o abono', descripcion: 'Recibir abono de la compra de urea', fecha: '2026-11-25', estado: 'Pendiente' },
  { id: 'K6', clienteId: 'C8', productoId: 'P5', tipo: 'Envío de cotización', descripcion: 'Cotizar semilla de maíz para 50 bultos', fecha: '2026-11-08', estado: 'Cumplido' },
];
