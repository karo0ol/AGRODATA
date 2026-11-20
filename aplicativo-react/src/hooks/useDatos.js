import { useContext } from 'react';
import { DatosContext } from '../context/contextos.js';

// Ventas y oportunidades compartidas entre pantallas:
// ventas, oportunidades, registrarVenta, agregarOportunidad, cambiarEstadoOportunidad, cerrarVenta
export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error('useDatos debe usarse dentro de un DatosProvider');
  }
  return contexto;
}

export default useDatos;
