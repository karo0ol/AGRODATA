// Prospectos de ejemplo (datos inventados): posibles clientes que aún no compran.
export const prospectos = [
  {
    id: 'PR1', nombre: 'Floricultores La Sabana', contacto: 'Marta Rojas', telefono: '3112223344',
    modeloNegocio: 'B2B', sector: 'Flores', departamento: 'Cundinamarca', municipio: 'Mosquera',
    seguimientos: [{ fecha: '2026-11-02', nota: 'Primer contacto. Interesados en fungicidas.' }],
  },
  {
    id: 'PR2', nombre: 'Finca El Mirador', contacto: 'Pedro Salcedo', telefono: '3004445566',
    modeloNegocio: 'B2C', sector: 'Papa', departamento: 'Boyacá', municipio: 'Tunja',
    seguimientos: [],
  },
  {
    id: 'PR3', nombre: 'Agrícola Los Almendros', contacto: 'Luisa Prieto', telefono: '3178889900',
    modeloNegocio: 'B2B', sector: 'Hortalizas', departamento: 'Tolima', municipio: 'Honda',
    seguimientos: [
      { fecha: '2026-10-28', nota: 'Pidió cotización de fungicidas.' },
      { fecha: '2026-11-11', nota: 'Se envió la cotización.' },
    ],
  },
];
