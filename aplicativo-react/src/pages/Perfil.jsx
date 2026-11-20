// Perfil: datos de la cuenta del RTC (M1 · SYS-FR-094, 095 y 096).
//   - Editar el nombre.                                                    (SYS-FR-094)
//   - Cambiar el correo: se envía un enlace de verificación al correo
//     NUEVO y el actual sigue siendo el de la cuenta hasta confirmarlo.    (SYS-FR-095)
//   - Cambiar la contraseña con la sesión iniciada, pidiendo la actual.    (SYS-FR-096)
//
// Las tres acciones necesitan internet: sin conexión los botones quedan
// desactivados y se muestra un aviso. En el sistema real el enlace llega por
// correo; en el prototipo se SIMULA con un botón.
//
// useAuth debe devolver: usuario, actualizarPerfil, correoPendiente,
// solicitarCambioCorreo, confirmarCambioCorreo, cancelarCambioCorreo, cambiarClaveConSesion.

import { useState } from 'react';
import { MailCheck, KeyRound, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useConexion } from '../hooks/useConexion.js';
import { useToast } from '../hooks/useToast.js';
import Tarjeta from '../components/ui/Tarjeta.jsx';
import CampoTexto from '../components/ui/CampoTexto.jsx';
import Boton from '../components/ui/Boton.jsx';
import Mensaje from '../components/ui/Mensaje.jsx';
import AvisoSinConexion from '../components/conexion/AvisoSinConexion.jsx';

export default function Perfil() {
  const {
    usuario,
    actualizarPerfil,
    correoPendiente,
    solicitarCambioCorreo,
    confirmarCambioCorreo,
    cancelarCambioCorreo,
    cambiarClaveConSesion,
  } = useAuth();
  const { enLinea } = useConexion();
  const mostrarToast = useToast();

  // ----- Datos del perfil -----
  const [nombre, setNombre] = useState(usuario.nombre);
  const [errorNombre, setErrorNombre] = useState('');

  // ----- Cambio de correo -----
  const [correoNuevo, setCorreoNuevo] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');

  // ----- Cambio de contraseña -----
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [errorClave, setErrorClave] = useState('');

  const guardarNombre = (e) => {
    e.preventDefault();
    const resultado = actualizarPerfil({ nombre });
    if (!resultado.ok) {
      setErrorNombre(resultado.error);
      return;
    }
    setErrorNombre('');
    mostrarToast('Perfil actualizado correctamente');
  };

  const pedirCambioCorreo = (e) => {
    e.preventDefault();
    const resultado = solicitarCambioCorreo(correoNuevo);
    if (!resultado.ok) {
      setErrorCorreo(resultado.error);
      return;
    }
    setErrorCorreo('');
    setCorreoNuevo('');
  };

  // Simula el clic en el enlace que llega al correo nuevo
  const simularClicEnlace = () => {
    const resultado = confirmarCambioCorreo();
    if (!resultado.ok) {
      setErrorCorreo(resultado.error);
      return;
    }
    setErrorCorreo('');
    mostrarToast('Correo actualizado correctamente');
  };

  const guardarClave = (e) => {
    e.preventDefault();
    if (nueva !== confirmar) {
      setErrorClave('Las contraseñas nuevas no coinciden. Escríbelas de nuevo.');
      return;
    }
    const resultado = cambiarClaveConSesion({ actual, nueva });
    if (!resultado.ok) {
      setErrorClave(resultado.error);
      return;
    }
    setErrorClave('');
    setActual('');
    setNueva('');
    setConfirmar('');
    mostrarToast('Contraseña actualizada correctamente');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Mi perfil</h2>
          <div className="subtitle">Datos de tu cuenta de representante técnico comercial</div>
        </div>
      </div>

      <AvisoSinConexion>
        Editar el perfil, el correo y la contraseña necesita internet. Vuelve a intentarlo cuando
        recuperes la conexión.
      </AvisoSinConexion>

      <div style={{ display: 'grid', gap: 16, maxWidth: 640 }}>
        {/* ---------- DATOS DEL PERFIL (SYS-FR-094) ---------- */}
        <Tarjeta titulo="Datos del perfil">
          <form onSubmit={guardarNombre} noValidate>
            <CampoTexto
              id="perfil-nombre"
              etiqueta="Nombre"
              valor={nombre}
              onChange={setNombre}
              autoComplete="name"
              requerido
              error={errorNombre}
            />
            <div style={{ marginTop: 14 }}>
              <Boton type="submit" icono={UserRound} disabled={!enLinea}>
                Guardar cambios
              </Boton>
            </div>
          </form>
        </Tarjeta>

        {/* ---------- CORREO (SYS-FR-095) ---------- */}
        <Tarjeta titulo="Correo de la cuenta">
          <p style={{ margin: '0 0 12px', fontSize: 13.5 }}>
            Correo actual: <strong>{usuario.correo}</strong>
          </p>

          {correoPendiente ? (
            <>
              <Mensaje tipo="aviso">
                Enviamos un enlace de verificación a <strong>{correoPendiente}</strong>. Tu correo
                actual sigue siendo <strong>{usuario.correo}</strong> hasta que confirmes el cambio.
              </Mensaje>
              {errorCorreo && <Mensaje tipo="error">{errorCorreo}</Mensaje>}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Boton icono={MailCheck} onClick={simularClicEnlace} disabled={!enLinea}>
                  Simular clic en el enlace del correo
                </Boton>
                <Boton
                  variante="contorno"
                  onClick={() => {
                    cancelarCambioCorreo();
                    setErrorCorreo('');
                  }}
                >
                  Cancelar cambio
                </Boton>
              </div>
            </>
          ) : (
            <form onSubmit={pedirCambioCorreo} noValidate>
              <CampoTexto
                id="perfil-correo-nuevo"
                etiqueta="Correo nuevo"
                tipo="email"
                valor={correoNuevo}
                onChange={setCorreoNuevo}
                placeholder="nombre@correo.com"
                autoComplete="email"
                requerido
                error={errorCorreo}
                ayuda="Te enviaremos un enlace de verificación para confirmar el cambio."
              />
              <div style={{ marginTop: 14 }}>
                <Boton type="submit" icono={MailCheck} disabled={!enLinea}>
                  Enviar enlace de verificación
                </Boton>
              </div>
            </form>
          )}
        </Tarjeta>

        {/* ---------- CONTRASEÑA (SYS-FR-096) ---------- */}
        <Tarjeta titulo="Cambiar contraseña">
          <form onSubmit={guardarClave} noValidate>
            <div style={{ display: 'grid', gap: 12 }}>
              <CampoTexto
                id="perfil-clave-actual"
                etiqueta="Contraseña actual"
                tipo="password"
                valor={actual}
                onChange={setActual}
                autoComplete="current-password"
                requerido
              />
              <CampoTexto
                id="perfil-clave-nueva"
                etiqueta="Contraseña nueva"
                tipo="password"
                valor={nueva}
                onChange={setNueva}
                autoComplete="new-password"
                requerido
                ayuda="Mínimo 8 caracteres, con letras y números."
              />
              <CampoTexto
                id="perfil-clave-confirmar"
                etiqueta="Confirmar contraseña nueva"
                tipo="password"
                valor={confirmar}
                onChange={setConfirmar}
                autoComplete="new-password"
                requerido
                error={errorClave}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <Boton type="submit" icono={KeyRound} disabled={!enLinea}>
                Cambiar contraseña
              </Boton>
            </div>
          </form>
        </Tarjeta>
      </div>
    </>
  );
}
