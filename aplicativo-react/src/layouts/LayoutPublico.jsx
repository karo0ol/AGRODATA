// LayoutPublico: estructura de las pantallas SIN sesión
// (Login, Registro, Verificar correo, Recuperar contraseña).
// Muestra el collage de fotos a la izquierda y, a la derecha, el formulario
// que corresponda a la ruta actual.

import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Leaf, Users, RefreshCw, Handshake, Sprout, Wheat, Tablet } from 'lucide-react'; // íconos
import { useAuth } from '../hooks/useAuth.js';

// Una foto del collage. Si el archivo no existe o no se puede abrir (por ejemplo, si todavía
// no está en public/img), en vez del ícono de imagen rota se muestra un recuadro decorativo.
function Foto({ clase, src, alt, Icono }) {
  const [fallo, setFallo] = useState(false);
  return (
    <div className={`photo ${clase}`}>
      {fallo ? (
        <div className="photo-vacia" role="img" aria-label={alt}>
          <Icono size={44} aria-hidden="true" />
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setFallo(true)} />
      )}
    </div>
  );
}

export default function LayoutPublico() {
  // Leemos del contexto de sesión si ya hay un usuario con la sesión iniciada
  const { usuario } = useAuth();

  // Si ya inició sesión, no tiene sentido mostrarle el login:
  // lo mandamos al panel. "replace" evita que el botón "atrás" vuelva al login.
  if (usuario) return <Navigate to="/" replace />;

  return (
    // Los nombres de clase (screen-login, login-left, collage...) vienen
    // de styles.css, el CSS de tu prototipo.
    <div id="screen-login">

      {/* ----- LADO IZQUIERDO: collage de fotos ----- */}
      <div className="login-left">
        <div className="collage">
          {/* Las imágenes están en public/img, por eso la ruta empieza con "/img" */}
          <Foto clase="c1" src="/img/foto-acuerdo.png" alt="Acuerdo comercial" Icono={Handshake} />
          <Foto clase="c3" src="/img/foto-cultivo.png" alt="Cultivo al atardecer" Icono={Sprout} />
          <Foto clase="c2" src="/img/foto-agricultora.png" alt="Agricultora revisando cultivo" Icono={Wheat} />
          <Foto clase="c4" src="/img/foto-tablet.png" alt="Agricultor con tablet" Icono={Tablet} />

          {/* Círculos verdes decorativos con ícono */}
          <div className="badge badge-1"><Leaf size={22} /></div>
          <div className="badge badge-2"><Users size={22} /></div>
          <div className="badge badge-3"><RefreshCw size={22} /></div>
        </div>
      </div>

      {/* ----- LADO DERECHO: aquí se dibuja la página de la ruta -----
          <Outlet /> es el "hueco". Si la URL es /login, aparece Login;
          si es /registro, aparece Registro; y así con las demás. */}
      <div className="login-right">
        <Outlet />
      </div>

    </div>
  );
}