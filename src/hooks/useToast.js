import { useContext } from 'react';
import { ToastContext } from '../context/contextos.js';

// Devuelve una función: const mostrarToast = useToast(); mostrarToast('Guardado');
// También trae atajos: mostrarToast.error('...'), .advertencia('...'), .info('...')
export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return contexto;
}

export default useToast;
