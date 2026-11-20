// Sidebar: menú lateral izquierdo (solo escritorio; en celular lo oculta extras.css).
//   - Marca AgroData, tarjeta del usuario y los grupos del menú.
//   - NavLink marca solo la opción activa según la dirección actual.
//   - Botón para cerrar sesión.
//
// useAuth debe devolver { usuario, cerrarSesion }.
//   usuario: { nombre, ... }

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { GRUPOS_MENU } from './menu.js';

// "Karol Tatiana Delgado" -> "KT"
const iniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export default function Sidebar() {
  const { usuario, cerrarSesion } = useAuth();
  const mostrarToast = useToast();
  const navigate = useNavigate();

  const salir = () => {
    cerrarSesion();
    navigate('/login');
    mostrarToast('Sesión cerrada');
  };

  return (
    <aside className="sidebar" aria-label="Menú principal">
      <div className="brand">
        <div className="logo-mark">🌱</div>
        <h1>AgroData</h1>
      </div>

      {/* Al tocar la tarjeta se abre la pantalla Mi perfil */}
      <Link to="/perfil" className="user-card" aria-label="Mi perfil">
        <div className="avatar">{iniciales(usuario.nombre)}</div>
        <div>
          <div className="u-name">{usuario.nombre}</div>
          <div className="u-role">Representante técnico comercial</div>
        </div>
      </Link>

      <nav className="nav-scroll">
        {GRUPOS_MENU.map((grupo) => (
          <div className="nav-group" key={grupo.titulo}>
            <div className="nav-group-label">{grupo.titulo}</div>
            {grupo.items.map(({ ruta, texto, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                end={ruta === '/'}   // "/" solo se marca activa en el panel, no en todas las rutas
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icono aria-hidden="true" />
                {texto}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="logout-wrap">
        <button type="button" className="logout-btn" onClick={salir}>
          <LogOut size={17} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}