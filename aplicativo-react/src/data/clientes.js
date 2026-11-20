// Clientes de ejemplo (datos inventados).
//   zona: se toma del municipio.   nit: sin puntos ni dígito de verificación ('' si no tiene).
//   documentos: true = cargado · false = sin cargar.
//   ultimaVisita: 'AAAA-MM-DD' (null si nunca se le ha visitado).
export const clientes = [
  {
    id: 'C1', nombre: 'Agropecuaria El Rosal', nit: '900123456',
    zona: 'Facatativá', departamento: 'Cundinamarca', municipio: 'Facatativá',
    tipo: 'B2B', estado: 'Activo',
    documentos: { rut: true, camara: true, cedula: true, banco: true },
    ultimaVisita: '2026-11-12', cultivo: 'Flores',
    productosInteres: ['Fertilizante NPK 15-15-15', 'Fungicida cobre'],
  },
  {
    id: 'C2', nombre: 'Hacienda La Esperanza', nit: '800765432',
    zona: 'Espinal', departamento: 'Tolima', municipio: 'Espinal',
    tipo: 'B2B', estado: 'Activo',
    documentos: { rut: true, camara: true, cedula: false, banco: true },
    ultimaVisita: '2026-11-05', cultivo: 'Cereales',
    productosInteres: ['Urea granulada'],
  },
  {
    id: 'C3', nombre: 'Cultivos del Valle S.A.S.', nit: '901234567',
    zona: 'Palmira', departamento: 'Valle del Cauca', municipio: 'Palmira',
    tipo: 'B2B', estado: 'Activo',
    documentos: { rut: true, camara: false, cedula: false, banco: false },
    ultimaVisita: '2026-10-30', cultivo: 'Caña de azúcar',
    productosInteres: ['Herbicida glifosato'],
  },
  {
    id: 'C4', nombre: 'Finca San Isidro', nit: '',
    zona: 'Ventaquemada', departamento: 'Boyacá', municipio: 'Ventaquemada',
    tipo: 'B2C', estado: 'Activo',
    documentos: { rut: false, camara: false, cedula: true, banco: false },
    ultimaVisita: '2026-10-05', cultivo: 'Papa',
    productosInteres: ['Fertilizante NPK 15-15-15', 'Fungicida cobre'],
  },
  {
    id: 'C5', nombre: 'Agroinsumos Los Pinos', nit: '860987654',
    zona: 'Rionegro', departamento: 'Antioquia', municipio: 'Rionegro',
    tipo: 'B2B', estado: 'Inactivo',
    documentos: { rut: true, camara: true, cedula: true, banco: false },
    ultimaVisita: '2026-09-10', cultivo: 'Hortalizas',
    productosInteres: [],
  },
  {
    id: 'C6', nombre: 'Finca Villa Clara', nit: '',
    zona: 'Madrid', departamento: 'Cundinamarca', municipio: 'Madrid',
    tipo: 'B2C', estado: 'Potencial',
    documentos: { rut: false, camara: false, cedula: false, banco: false },
    ultimaVisita: null, cultivo: 'Flores',
    productosInteres: ['Fungicida cobre'],
  },
  {
    id: 'C7', nombre: 'Cultivos La Colina', nit: '',
    zona: 'Chiquinquirá', departamento: 'Boyacá', municipio: 'Chiquinquirá',
    tipo: 'B2C', estado: 'Activo',
    documentos: { rut: false, camara: false, cedula: true, banco: true },
    ultimaVisita: '2026-11-10', cultivo: 'Papa',
    productosInteres: ['Urea granulada'],
  },
  {
    id: 'C8', nombre: 'Hacienda Los Almendros', nit: '830456789',
    zona: 'Ibagué', departamento: 'Tolima', municipio: 'Ibagué',
    tipo: 'B2B', estado: 'Potencial',
    documentos: { rut: true, camara: false, cedula: false, banco: false },
    ultimaVisita: '2026-11-14', cultivo: 'Cereales',
    productosInteres: ['Semilla de maíz híbrido'],
  },
];
