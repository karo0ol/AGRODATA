// LayoutPrivado: estructura de TODAS las pantallas internas
// (Panel, Clientes, Agenda, Ventas, Reportes...).
//
//   ┌──────────┬───────────────────────┐
//   │ Sidebar  │ Header                │
//   │ (menú)   ├───────────────────────┤
//   │          │ contenido (<Outlet/>) │
//   └──────────┴───────────────────────┘
//
// En celular el Sidebar se oculta (lo hace extras.css) y aparece
// NavegacionMovil, la barra inferior.

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';
import NavegacionMovil from '../components/layout/NavegacionMovil.jsx';

export default function LayoutPrivado() {
  const { usuario } = useAuth();

  // PROTECCIÓN DE RUTAS: si no hay sesión iniciada, cualquier pantalla interna
  // redirige al login. Así no hay que repetir esta revisión en cada página.
  if (!usuario) return <Navigate to="/login" replace />;

  return (
    // "app-shell" y "main-col" son clases de styles.css (el prototipo)
    <div id="app-shell">

      {/* Menú lateral izquierdo (fijo) */}
      <Sidebar />

      <div className="main-col">
        {/* Barra superior: indicador de conexión, alertas y perfil */}
        <Header />

        {/* Zona de contenido: aquí cambia la pantalla según la ruta.
            Si la URL es /clientes, <Outlet /> dibuja la página Clientes. */}
        <main className="content">
          <Outlet />
        </main>
      </div>

      {/* Barra inferior, visible solo en celular */}
      <NavegacionMovil />
    </div>
  );
}