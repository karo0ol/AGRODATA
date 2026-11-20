// Registro: crear una cuenta de RTC con correo y contraseña (M1 · SYS-FR-001).
// La cuenta queda SIN verificar y pasa a VerificarCorreo (SYS-FR-002).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import CampoClave from '../components/ui/CampoClave.jsx';

export default function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  // ----- ESTADO: un useState por cada campo del formulario -----
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [acepta, setAcepta] = useState(false);   // casilla de la Ley 1581: true / false
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();

    // ----- VALIDACIONES, una por una, con mensajes claros en español (SYS-US-006) -----
    // Cada "return" detiene el envío y deja el error en pantalla.
    if (clave.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (clave !== confirmar) {
      setError('Las contraseñas no coinciden. Escríbelas de nuevo.');
      return;
    }
    if (!acepta) {
      setError('Debes aceptar el tratamiento de datos personales para crear tu cuenta.');
      return;
    }

    // Crea la cuenta (simulada). Falla si ese correo ya estaba registrado.
    const resultado = registrar({ nombre, correo, clave });
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }

    // Todo bien: pasa a verificar el correo.
    // "state" envía el correo a la otra pantalla sin ponerlo en la dirección.
    navigate('/verificar-correo', { state: { correo } });
  };

  return (
    <div className="login-box">
      <div className="brand">
        <div className="logo-mark">🌱</div>
        <h1>AgroData</h1>
      </div>
      <h2>Crea tu cuenta</h2>
      <p className="sub">Regístrate con tu correo para empezar a gestionar tu cartera</p>

      {error && <div className="form-error" role="alert">{error}</div>}

      <form onSubmit={enviar}>
        <div className="field">
          <label htmlFor="reg-nombre">Nombre completo</label>
          <div className="input-wrap">
            <input
              id="reg-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre y apellido"
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="reg-correo">Correo electrónico</label>
          <div className="input-wrap">
            <input
              id="reg-correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="nombre@correo.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Dos campos de contraseña: la clave y su confirmación */}
        <CampoClave
          id="reg-clave"
          etiqueta="Contraseña (mínimo 8 caracteres)"
          valor={clave}
          onChange={setClave}
          autoComplete="new-password"
          minLength={8}
        />
        <CampoClave
          id="reg-confirmar"
          etiqueta="Confirmar contraseña"
          valor={confirmar}
          onChange={setConfirmar}
          autoComplete="new-password"
          minLength={8}
        />

        {/* Consentimiento de datos personales (Ley 1581 de 2012).
            En una casilla se usa "checked" y "e.target.checked" (no "value"). */}
        <div className="privacy-check">
          <input
            id="reg-acepta"
            type="checkbox"
            checked={acepta}
            onChange={(e) => setAcepta(e.target.checked)}
          />
          <label htmlFor="reg-acepta">
            Autorizo el tratamiento de mis datos personales conforme a la Ley 1581 de 2012.
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          <UserPlus size={16} /> Crear cuenta
        </button>
      </form>

      <Link className="forgot-link" to="/login">← Ya tengo cuenta, iniciar sesión</Link>
    </div>
  );
}