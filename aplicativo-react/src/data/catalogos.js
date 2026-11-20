// Listas fijas del sistema: lo que el RTC ELIGE de una lista en vez de digitarlo.
// Si necesitas más departamentos o municipios, agrégalos aquí (solo aquí).

// ----- Ubicación -----
export const municipiosPorDepartamento = {
  'Antioquia': ['Medellín', 'Rionegro', 'Marinilla', 'La Ceja', 'El Carmen de Viboral'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Ventaquemada', 'Villa de Leyva'],
  'Caldas': ['Manizales', 'Chinchiná', 'Villamaría'],
  'Cundinamarca': ['Facatativá', 'Madrid', 'Mosquera', 'Funza', 'Zipaquirá', 'Chía', 'Fusagasugá', 'Soacha'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón'],
  'Meta': ['Villavicencio', 'Granada', 'Acacías'],
  'Nariño': ['Pasto', 'Ipiales', 'Túquerres'],
  'Santander': ['Bucaramanga', 'Girón', 'San Gil', 'Socorro'],
  'Tolima': ['Ibagué', 'Espinal', 'Honda', 'Chaparral'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Tuluá', 'Buga', 'Cartago'],
};

export const departamentos = Object.keys(municipiosPorDepartamento);

// ----- Clientes y prospectos -----
export const modelosNegocio = ['B2B', 'B2C'];

export const sectores = [
  'Flores', 'Café', 'Papa', 'Hortalizas', 'Frutales', 'Cereales', 'Caña de azúcar', 'Ganadería',
];

// ----- Visitas (M3) -----
// "Seguimiento" debe estar en la lista: lo usan Agenda, Alertas y Seguimiento.
export const objetivosVisita = [
  'Visita comercial',
  'Toma de pedido',
  'Entrega de producto',
  'Asesoría técnica',
  'Cobro',
  'Seguimiento',
];

export const resultadosVisita = [
  'Venta realizada',
  'Interesado',
  'Pendiente de decisión',
  'Sin interés',
  'No se encontró al cliente',
];

// ----- Compromisos (M4) -----
export const tiposCompromiso = [
  'Entrega de producto',
  'Envío de cotización',
  'Visita pactada',
  'Pago o abono',
  'Muestra o demostración',
  'Otro',
];
