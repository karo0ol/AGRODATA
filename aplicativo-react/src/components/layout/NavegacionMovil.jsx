// NavegacionMovil: barra inferior para celular (extras.css la muestra solo en pantallas angostas).
// Tiene TODAS las pantallas del menú y se desplaza de lado, para que ninguna quede inalcanzable.

import { NavLink } from 'react-router-dom';
import { GRUPOS_MENU } from './menu.js';

const ITEMS = GRUPOS_MENU.flatMap((grupo) => grupo.items);

export default function NavegacionMovil() {
  return (
    <nav className="nav-movil" aria-label="Menú móvil">
      {ITEMS.map(({ ruta, texto, corto, icono: Icono }) => (
        <NavLink
          key={ruta}
          to={ruta}
          end={ruta === '/'}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <Icono aria-hidden="true" />
          <span>{corto ?? texto}</span>
        </NavLink>
      ))}
    </nav>
  );
}