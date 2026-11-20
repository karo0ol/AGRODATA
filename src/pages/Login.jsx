// Login: pantalla de inicio de sesión (M1 · SYS-FR-003).
// Se dibuja en el lado derecho de LayoutPublico (en el hueco <Outlet />).

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import CampoClave from '../components/ui/CampoClave.jsx';

export default function Login() {
  const { iniciarSesion } = useAuth();   // función del contexto de sesión (simulada)
  const mostrarToast = useToast();       // para el aviso "¡Bienvenido!"
  const navigate = useNavigate();        // para cambiar de pantalla desde el código
  const location = useLocation();        // da acceso a datos enviados desde otra pantalla

  // ----- ESTADO -----
  // useState guarda lo que el usuario escribe. Cada vez que cambia, React redibuja.
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');   // mensaje de error (vacío = no hay error)

  // Mensaje que pudo enviar otra pantalla, por ejemplo VerificarCorreo
  // ("Correo verificado. Ya puedes iniciar sesión."). Si no hay, queda undefined.
  const mensajeOk = location.state?.mensaje;

  // ----- ENVÍO DEL FORMULARIO -----
  const enviar = (e) => {
    e.preventDefault();   // evita que el navegador recargue la página al enviar

    // iniciarSesion devuelve { ok: true } o { ok: false, error: "mensaje" }
    const resultado = iniciarSesion(correo, clave);

    if (!resultado.ok) {
      setError(resultado.error);   // muestra el error en español (SYS-US-006)
      return;                      // y no continúa
    }

    // Credenciales correctas: va al panel y muestra el aviso
    navigate('/');
    mostrarToast('¡Bienvenido a AgroData!');
  };

  return (
    // Las clases (login-box, brand, field...) vienen de styles.css del prototipo
    <div className="login-box">
      <div className="brand">
        <div className="logo-mark">🌱</div>
        <h1>AgroData</h1>
      </div>
      <h2>Bienvenido</h2>
      <p className="sub">Ingresa a tu panel de gestión comercial</p>

      {/* Se dibujan solo si existen: "cond && <algo/>" muestra <algo/> si cond es verdadera */}
      {mensajeOk && <div className="form-ok" role="status">{mensajeOk}</div>}
      {error && <div className="form-error" role="alert">{error}</div>}

      <form onSubmit={enviar}>
        <div className="field">
          <label htmlFor="login-correo">Correo electrónico</label>
          <div className="input-wrap">
            <input
              id="login-correo"
              type="email"
              value={correo}                            // el valor viene del estado
              onChange={(e) => setCorreo(e.target.value)} // y se actualiza al escribir
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Campo de contraseña con el ojito para mostrar u ocultar */}
        <CampoClave
          id="login-clave"
          etiqueta="Contraseña"
          valor={clave}
          onChange={setClave}
          autoComplete="current-password"
        />

        <button type="submit" className="btn btn-primary">
          <LogIn size={16} /> Iniciar sesión
        </button>
      </form>

      {/* <Link> navega sin recargar la página (a diferencia de <a href>) */}
      <Link className="forgot-link" to="/recuperar-contrasena">¿No recuerdas tu contraseña?</Link>
      <Link className="btn-secondary-link" to="/registro">¿Aún no tienes cuenta? Regístrate</Link>
    </div>
  );
}