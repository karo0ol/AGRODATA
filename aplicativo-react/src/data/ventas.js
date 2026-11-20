// Ventas de ejemplo (datos inventados). Cada venta guarda el precio y el valor usados ese día.
// valorTotal = null cuando el producto no tenía precio ("Sin precio").
// presentacion y semana se usan para detectar duplicados al importar el Excel.
export const ventas = [
  { id: 'V1', clienteId: 'C1', productoId: 'P1', producto: 'Fertilizante NPK 15-15-15', presentacion: 'bulto 50 kg', semana: 42, cantidad: 20, precioUnitario: 145000, fecha: '2026-10-14', valorTotal: 2900000 },
  { id: 'V2', clienteId: 'C2', productoId: 'P2', producto: 'Urea granulada', presentacion: 'bulto 50 kg', semana: 43, cantidad: 30, precioUnitario: 128000, fecha: '2026-10-21', valorTotal: 3840000 },
  { id: 'V3', clienteId: 'C1', productoId: 'P3', producto: 'Fungicida cobre', presentacion: 'litro', semana: 44, cantidad: 10, precioUnitario: 62000, fecha: '2026-10-28', valorTotal: 620000 },
  { id: 'V4', clienteId: 'C3', productoId: 'P4', producto: 'Herbicida glifosato', presentacion: 'galón', semana: 45, cantidad: 15, precioUnitario: 98000, fecha: '2026-11-04', valorTotal: 1470000 },
  { id: 'V5', clienteId: 'C4', productoId: 'P1', producto: 'Fertilizante NPK 15-15-15', presentacion: 'bulto 50 kg', semana: 45, cantidad: 12, precioUnitario: 145000, fecha: '2026-11-06', valorTotal: 1740000 },
  { id: 'V6', clienteId: 'C7', productoId: 'P2', producto: 'Urea granulada', presentacion: 'bulto 50 kg', semana: 46, cantidad: 8, precioUnitario: 128000, fecha: '2026-11-10', valorTotal: 1024000 },
  { id: 'V7', clienteId: 'C8', productoId: 'P5', producto: 'Semilla de maíz híbrido', presentacion: 'bulto 25 kg', semana: 46, cantidad: 10, precioUnitario: null, fecha: '2026-11-13', valorTotal: null },
];
