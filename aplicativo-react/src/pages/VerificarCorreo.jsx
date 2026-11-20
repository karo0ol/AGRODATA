// VerificarCorreo: confirma el correo recién registrado (M1 · SYS-FR-002).
// En el sistema real el usuario abriría un enlace que llega por email;
// en el prototipo ese enlace se SIMULA con un botón.

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck, CircleCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function VerificarCorreo() {
  const { verificarCorreo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // El correo lo envió Registro con navigate(..., { state: { correo } })
  const correo = location.state?.correo;

  // false = esperando el clic en el enlace · true = ya verificado
  const [verificado, setVerificado] = useState(false);

  // Si alguien entra directo a /verificar-correo sin pasar por el registro,
  // no hay correo que verificar: lo mandamos al login.
  if (!correo) return <Navigate to="/login" replace />;

  // Simula el clic en el enlace del correo: marca la cuenta como verificada
  const simularClicEnlace = () => {
    verificarCorreo(correo);
    setVerificado(true);
  };

  // Va al login llevando un mensaje que Login mostrará en la caja verde
  const irAlLogin = () =>
    navigate('/login', { state: { mensaje: 'Correo verificado. Ya puedes iniciar sesión.' } });

  // ----- PANTALLA 2: correo ya verificado -----
  // Con "return" anticipado, esta pantalla reemplaza a la de abajo.
  if (verificado) {
    return (
      <div className="forgot-card">
        <div className="icon-circle"><CircleCheck color="#fff" /></div>
        <h2>¡Correo verificado!</h2>
        <p>Tu cuenta quedó habilitada. Ya puedes iniciar sesión en AgroData.</p>
        <button type="button" className="btn btn-primary" onClick={irAlLogin}>
          Ir a iniciar sesión
        </button>
      </div>
    );
  }

  // ----- PANTALLA 1: esperando la verificación -----
  return (
    <div className="forgot-card">
      <div className="icon-circle"><MailCheck color="#fff" /></div>
      <h2>Verifica tu correo</h2>
      <p>
        Te enviamos un enlace de verificación a <strong>{correo}</strong>.
        Tu cuenta se habilitará solo después de confirmarlo.
      </p>
      <button type="button" className="btn btn-primary" onClick={simularClicEnlace}>
        Simular clic en el enlace del correo
      </button>
      <Link className="back-to-login" to="/login">← Volver a iniciar sesión</Link>
    </div>
  );
}