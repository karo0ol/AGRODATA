import { useContext } from "react";
import { ConexionContext } from '../context/contextos.js';

// Da acceso al estado de conexión:
// enLinea, pendientes (número de cambios sin enviar), alternarConexion, agregarPendiente
export function useConexion() {
  const contexto = useContext(ConexionContext);
  if (!contexto) {
    throw new Error("useConexion debe usarse dentro de un ConexionProvider");
  }
  return contexto;
}

export default useConexion;