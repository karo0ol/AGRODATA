// NoEncontrada: se muestra cuando la dirección (URL) no corresponde a ninguna pantalla.
// Está dentro de LayoutPrivado, así que el menú lateral sigue visible.

import { Link, useLocation } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';

export default function NoEncontrada() {
  // useLocation devuelve la dirección actual; pathname es la parte "/algo/mas"
  const { pathname } = useLocation();

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: 520, margin: '40px auto' }}>
      <div className="confirm-icon yellow">
        <SearchX />
      </div>
      <h3 style={{ justifyContent: 'center' }}>Página no encontrada</h3>
      <p>
        No existe ninguna pantalla en <strong>{pathname}</strong>. Revisa la dirección o vuelve al
        inicio.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
        <Home size={16} /> Volver al panel
      </Link>
    </div>
  );
}