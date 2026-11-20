// RecuperarContrasena: recuperar la contraseña con un enlace de un solo uso
// que vence en 30 minutos (M1 · SYS-FR-007, SYS-SEC-005).
// En el sistema real el enlace llega por correo; en el prototipo se SIMULA con botones.
//
// Pasos:  1 = pedir correo · 2 = "enlace enviado" · 3 = nueva contraseña · 4 = listo
//         'vencido' = el enlace caducó (se muestra si se simula el vencimiento)

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, MailCheck, LockKeyhole, CircleCheck, TimerOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import CampoClave from '../components/ui/CampoClave.jsx';

export default function RecuperarContrasena() {
  const { cambiarClave } = useAuth();   // función NUEVA del AuthContext (ver nota al final)
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');

  // PASO 1 → 2: "envía" el enlace. Siempre avanza, exista o no el correo,
  // para no revelar qué correos están registrados.
  const enviarEnlace = (e) => {
    e.preventDefault();
    setError('');
    setPaso(2);
  };

  // PASO 3 → 4: valida y guarda la nueva contraseña
  const guardarClave = (e) => {
    e.preventDefault();

    // SYS-SEC-003: mínimo 8 caracteres con letras y números
    if (nueva.length < 8 || !/[a-zA-Z]/.test(nueva) || !/\d/.test(nueva)) {
      setError('La contraseña debe tener al menos 8 caracteres, con letras y números.');
      return;
    }
    if (nueva !== confirmar) {
      setError('Las contraseñas no coinciden. Escríbelas de nuevo.');
      return;
    }

    const resultado = cambiarClave(correo, nueva);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setError('');
    setPaso(4);
  };

  // Vuelve al paso 1 limpiando todo (se usa cuando el enlace venció)
  const pedirOtroEnlace = () => {
    setNueva('');
    setConfirmar('');
    setError('');
    setPaso(1);
  };

  // ----- PASO 'vencido': el enlace caducó (30 minutos) o ya se usó -----
  if (paso === 'vencido') {
    return (
      <div className="forgot-card">
        <div className="icon-circle"><TimerOff color="#fff" /></div>
        <h2>El enlace venció</h2>
        <p>
          Los enlaces de recuperación son de un solo uso y duran 30 minutos.
          Solicita uno nuevo para continuar.
        </p>
        <button type="button" className="btn btn-primary" onClick={pedirOtroEnlace}>
          Solicitar nuevo enlace
        </button>
        <Link className="back-to-login" to="/login">← Volver a iniciar sesión</Link>
      </div>
    );
  }

  // ----- PASO 4: contraseña actualizada -----
  if (paso === 4) {
    return (
      <div className="forgot-card">
        <div className="icon-circle"><CircleCheck color="#fff" /></div>
        <h2>¡Contraseña actualizada!</h2>
        <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/login', { state: { mensaje: 'Contraseña actualizada. Ya puedes iniciar sesión.' } })}
        >
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  // ----- PASO 3: escribir la nueva contraseña -----
  if (paso === 3) {
    return (
      <div className="forgot-card">
        <div className="icon-circle"><LockKeyhole color="#fff" /></div>
        <h2>Nueva contraseña</h2>
        <p>Elige una contraseña de al menos 8 caracteres, con letras y números.</p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form onSubmit={guardarClave}>
          <CampoClave
            id="rec-nueva"
            etiqueta="Nueva contraseña"
            valor={nueva}
            onChange={setNueva}
            autoComplete="new-password"
            minLength={8}
          />
          <CampoClave
            id="rec-confirmar"
            etiqueta="Confirmar contraseña"
            valor={confirmar}
            onChange={setConfirmar}
            autoComplete="new-password"
            minLength={8}
          />
          <button type="submit" className="btn btn-primary">Guardar contraseña</button>
        </form>
      </div>
    );
  }

  // ----- PASO 2: enlace enviado -----
  if (paso === 2) {
    return (
      <div className="forgot-card">
        <div className="icon-circle"><MailCheck color="#fff" /></div>
        <h2>Revisa tu correo</h2>
        <p>
          Si <strong>{correo}</strong> está registrado, te enviamos un enlace para
          restablecer tu contraseña. Es de un solo uso y vence en 30 minutos.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setPaso(3)}>
          Simular clic en el enlace del correo
        </button>
        <button type="button" className="link-suave" onClick={() => setPaso('vencido')}>
          Simular enlace vencido
        </button>
        <Link className="back-to-login" to="/login">← Volver a iniciar sesión</Link>
      </div>
    );
  }

  // ----- PASO 1: pedir el correo -----
  return (
    <div className="forgot-card">
      <div className="icon-circle"><KeyRound color="#fff" /></div>
      <h2>Restablecer contraseña</h2>
      <p>Escribe tu correo registrado y te enviaremos un enlace de recuperación.</p>

      <form onSubmit={enviarEnlace}>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="nombre@correo.com"
          autoComplete="email"
          aria-label="Correo electrónico"
          required
        />
        <button type="submit" className="btn btn-primary">Enviar enlace</button>
      </form>

      <Link className="back-to-login" to="/login">← Volver a iniciar sesión</Link>
    </div>
  );
}

/* NOTA: este archivo espera que useAuth() entregue una función nueva:
     cambiarClave(correo, claveNueva) → { ok: true } | { ok: false, error: "mensaje" }
   Agrégala en AuthContext.jsx junto a iniciarSesion, registrar y verificarCorreo. */