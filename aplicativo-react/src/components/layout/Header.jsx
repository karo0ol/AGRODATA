// Header: barra superior de las pantallas internas.
//   - Indicador de conexión (a la izquierda).
//   - Campana de alertas con punto rojo si hay algo para hoy o mañana.  (SYS-FR-032 y 040)
//   - Perfil del usuario (en celular solo el círculo con las iniciales); al tocarlo abre /perfil.
//   - Botón de cerrar sesión, visible solo en celular (allá no hay menú lateral).
//
// useAuth debe devolver { usuario, cerrarSesion }.
// <IndicadorConexion /> no recibe props: lee el estado desde useConexion().

import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { visitas } from '../../data/visitas.js';
import { compromisos } from '../../data/compromisos.js';
import { sumarDias } from '../../utils/fechas.js';
import IndicadorConexion from '../conexion/IndicadorConexion.jsx';

const iniciales = (nombre = '') =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export default function Header() {
  const { usuario, cerrarSesion } = useAuth();
  const mostrarToast = useToast();
  const navigate = useNavigate();

  // Hay alerta si hay una visita programada hoy o mañana, o un compromiso pendiente para mañana
  const hoy = new Date().toLocaleDateString('en-CA');
  const manana = sumarDias(hoy, 1);
  const hayAlertas =
    visitas.some((v) => v.estado === 'Programada' && (v.fecha === hoy || v.fecha === manana)) ||
    compromisos.some((c) => c.estado === 'Pendiente' && c.fecha === manana);

  const salir = () => {
    cerrarSesion();
    navigate('/login');
    mostrarToast('Sesión cerrada');
  };

  return (
    <header className="topbar">
      {/* Tiene margin-right: auto en el CSS, por eso empuja lo demás a la derecha */}
      <IndicadorConexion />

      <Link
        to="/alertas"
        className="icon-btn"
        aria-label={hayAlertas ? 'Ver alertas (hay alertas nuevas)' : 'Ver alertas'}
      >
        <Bell />
        {hayAlertas && <span className="badge-dot" aria-hidden="true" />}
      </Link>

      <Link to="/perfil" className="profile-chip" aria-label="Mi perfil">
        <div className="avatar">{iniciales(usuario.nombre)}</div>
        <span>{usuario.nombre.split(' ')[0]}</span>
      </Link>

      <button type="button" className="icon-btn solo-movil" onClick={salir} aria-label="Cerrar sesión">
        <LogOut />
      </button>
    </header>
  );
}