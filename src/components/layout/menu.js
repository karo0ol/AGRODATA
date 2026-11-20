// menu.js: lista de pantallas del menú. La usan Sidebar (escritorio) y NavegacionMovil (celular),
// así que si agregas una pantalla nueva, la agregas SOLO aquí.
//
// Cada grupo: { titulo, items: [{ ruta, texto, corto?, icono }] }
//   ruta:  la misma de App.jsx
//   corto: texto más corto para la barra inferior del celular (opcional)
//   icono: componente de lucide-react

import {
  LayoutDashboard, Users, UserPlus, CalendarDays, BellRing, ListChecks,
  Target, Handshake, Package, ShoppingCart, BarChart3, FileSpreadsheet,
} from 'lucide-react';

export const GRUPOS_MENU = [
  {
    titulo: 'INICIO',
    items: [
      { ruta: '/', texto: 'Panel', icono: LayoutDashboard },
    ],
  },
  {
    titulo: 'CLIENTES',
    items: [
      { ruta: '/clientes', texto: 'Clientes', icono: Users },
      { ruta: '/prospectos', texto: 'Prospectos', icono: UserPlus },
    ],
  },
  {
    titulo: 'ACTIVIDAD',
    items: [
      { ruta: '/agenda', texto: 'Agenda', icono: CalendarDays },
      { ruta: '/alertas', texto: 'Alertas', icono: BellRing },
      { ruta: '/seguimiento', texto: 'Seguimiento', icono: ListChecks },
    ],
  },
  {
    titulo: 'VENTAS',
    items: [
      { ruta: '/oportunidades', texto: 'Oportunidades', icono: Target },
      { ruta: '/compromisos', texto: 'Compromisos', icono: Handshake },
      { ruta: '/catalogo', texto: 'Catálogo', icono: Package },
      { ruta: '/ventas', texto: 'Ventas', icono: ShoppingCart },
    ],
  },
  {
    titulo: 'DATOS',
    items: [
      { ruta: '/reportes', texto: 'Reportes', icono: BarChart3 },
      { ruta: '/importar-exportar', texto: 'Importar / Exportar', corto: 'Importar', icono: FileSpreadsheet },
    ],
  },
];
