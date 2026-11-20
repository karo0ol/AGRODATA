import { useContext } from "react";
import { AuthContext } from '../context/contextos.js';

// Da acceso a la sesión del RTC:
// usuario, iniciarSesion, registrar, verificarCorreo, cambiarClave, cerrarSesion,
// y para el perfil: actualizarPerfil, correoPendiente, solicitarCambioCorreo,
// confirmarCambioCorreo, cancelarCambioCorreo, cambiarClaveConSesion
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}

export default useAuth;