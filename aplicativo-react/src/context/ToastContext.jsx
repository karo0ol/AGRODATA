// ToastContext: avisos flotantes ("Cliente creado correctamente", "Sesión cerrada"...).
//
// useToast() devuelve una FUNCIÓN, así que en las páginas se usa directo:
//     const mostrarToast = useToast();
//     mostrarToast('Cliente creado correctamente');
//
// Esa función también trae atajos por si quieres un aviso de otro tipo:
//     mostrarToast.error('No se pudo guardar');
//     mostrarToast.advertencia('Sin conexión');
//     mostrarToast.info('...');   mostrarToast.exito('...');
//
// Los estilos (#toast-container y .toast) vienen de styles.css, el del prototipo.

import { useCallback, useMemo, useState } from 'react';
import { ToastContext } from './contextos.js';

const DURACION_MS = 3500;

// Color de la franja izquierda según el tipo (el verde es el de .toast en styles.css)
const COLOR_BORDE = {
  error: '#e57373',
  advertencia: '#f2b84b',
};

// Número que sube con cada aviso, para darle a cada uno un id distinto
let ultimoId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const mostrar = useCallback((mensaje, tipo = 'exito') => {
    ultimoId += 1;
    const id = ultimoId;
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    // El aviso desaparece solo
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), DURACION_MS);
  }, []);

  // El valor es una función con atajos pegados (exito, error, info, advertencia)
  const valor = useMemo(() => {
    const funcion = (mensaje, tipo) => mostrar(mensaje, tipo);
    return Object.assign(funcion, {
      exito: (mensaje) => mostrar(mensaje, 'exito'),
      info: (mensaje) => mostrar(mensaje, 'info'),
      error: (mensaje) => mostrar(mensaje, 'error'),
      advertencia: (mensaje) => mostrar(mensaje, 'advertencia'),
    });
  }, [mostrar]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div id="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast"
            style={COLOR_BORDE[t.tipo] ? { borderLeftColor: COLOR_BORDE[t.tipo] } : undefined}
          >
            {t.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
