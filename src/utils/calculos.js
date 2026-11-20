/* ---------------- Dinero y porcentajes ---------------- */

// valor = cantidad × precio unitario (0 si falta alguno de los dos)
export function calcularValor(cantidad, precioUnitario) {
  const c = Number(cantidad);
  const p = Number(precioUnitario);
  if (!c || !p) return 0;
  return c * p;
}

// 2900000 -> "$ 2.900.000"
export function formatearMoneda(valor) {
  return Number(valor || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

export function calcularPorcentaje(parte, total) {
  if (!total) return 0;
  return Math.round((parte / total) * 100);
}

/* ---------------- Compromisos ---------------- */

// estado: 'Pendiente' | 'Cumplido' | 'Incumplido'
export function resumirCompromisos(compromisos = []) {
  const cumplidos = compromisos.filter((c) => c.estado === 'Cumplido').length;
  const incumplidos = compromisos.filter((c) => c.estado === 'Incumplido').length;
  const pendientes = compromisos.filter((c) => c.estado === 'Pendiente').length;
  const total = compromisos.length;
  return {
    total,
    cumplidos,
    pendientes,
    incumplidos,
    porcentaje: calcularPorcentaje(cumplidos, total),
  };
}

/* ---------------- Oportunidades ---------------- */

// [{ estado, cantidad }] en el orden de los estados que le pases
export function resumirOportunidadesPorEstado(oportunidades = [], estados = []) {
  return estados.map((estado) => ({
    estado,
    cantidad: oportunidades.filter((o) => o.estado === estado).length,
  }));
}

// % de oportunidades convertidas sobre las que ya se cerraron
export function tasaConversion(oportunidades = []) {
  const cerradas = ['Convertida', 'En pausa', 'Sin intención por ahora'];
  const convertidas = oportunidades.filter((o) => o.estado === 'Convertida').length;
  const total = oportunidades.filter((o) => cerradas.includes(o.estado)).length;
  return calcularPorcentaje(convertidas, total);
}

/* ---------------- Ventas (panel de métricas) ---------------- */

export function totalVentas(ventas = []) {
  return ventas.reduce((suma, v) => suma + Number(v.valorTotal || 0), 0);
}

// { "cli-001": 3520000, ... }
export function ventasPorCliente(ventas = []) {
  return ventas.reduce((acumulado, v) => {
    acumulado[v.clienteId] = (acumulado[v.clienteId] || 0) + Number(v.valorTotal || 0);
    return acumulado;
  }, {});
}

// [{ mes: "2026-10", total }] ordenado por mes
export function ventasPorMes(ventas = []) {
  const porMes = ventas.reduce((acumulado, v) => {
    const mes = v.fecha.slice(0, 7);
    acumulado[mes] = (acumulado[mes] || 0) + Number(v.valorTotal || 0);
    return acumulado;
  }, {});
  return Object.entries(porMes)
    .map(([mes, total]) => ({ mes, total }))
    .sort((a, b) => a.mes.localeCompare(b.mes));
}

// [{ productoId, nombre, cantidad, valor }] de mayor a menor valor
export function productosMasVendidos(ventas = [], productos = [], limite = 5) {
  const porProducto = ventas.reduce((acumulado, v) => {
    const actual = acumulado[v.productoId] || { cantidad: 0, valor: 0 };
    actual.cantidad += Number(v.cantidad || 0);
    actual.valor += Number(v.valorTotal || 0);
    acumulado[v.productoId] = actual;
    return acumulado;
  }, {});

  return Object.entries(porProducto)
    .map(([productoId, datos]) => ({
      productoId,
      nombre: productos.find((p) => p.id === productoId)?.nombre ?? "Producto",
      ...datos,
    }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, limite);
}

/* ---------------- Llaves para importar el Excel sin duplicar ---------------- */

// Quita tildes, pasa a minúscula y junta espacios: "  Finca  Él Rosal " -> "finca el rosal"
export function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// "900.123.456-7" -> "900123456" (sin puntos, guiones ni dígito de verificación).
// Si el NIT llega sin guion no se puede saber cuál es el dígito de verificación,
// así que solo se limpian los separadores.
export function normalizarNIT(nit = "") {
  const sinDV = String(nit).split("-")[0];
  return sinDV.replace(/\D/g, "");
}

// Llave de cliente: NIT normalizado + finca normalizada
export function llaveCliente(cliente) {
  return `${normalizarNIT(cliente.nit)}|${normalizarTexto(cliente.finca)}`;
}

// Llave de venta del Excel: cliente + producto + presentación + semana + fecha
export function llaveVenta(venta) {
  return [
    venta.clienteId,
    venta.productoId,
    normalizarTexto(venta.presentacion),
    venta.semana,
    venta.fecha,
  ].join("|");
}