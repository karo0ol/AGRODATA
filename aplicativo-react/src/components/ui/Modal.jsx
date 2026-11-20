// Modal: ventana emergente sobre el contenido (formularios, confirmaciones).
//
// PROPS:
//   titulo:   texto del encabezado
//   onCerrar: función que se llama al cerrar (botón X, tecla Esc o clic fuera de la ventana)
//   tamano:   'sm' | 'md' (por defecto) | 'lg'
//   children: el contenido (normalmente un formulario)
//
// Cada página lo dibuja con "{verFormulario && <Modal ...>}", así que se crea al abrir
// y se destruye al cerrar. Para que la animación de entrada se vea, la clase "show"
// se agrega un instante DESPUÉS de dibujarlo.
//
// ACCESIBILIDAD (SYS-US-007):
//   - role="dialog" y aria-modal para los lectores de pantalla.
//   - Al abrir, el foco pasa al primer campo; Tab y Shift+Tab se quedan dentro de la ventana.
//   - Esc cierra y, al cerrar, el foco vuelve al botón que lo abrió.

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const CLASE_TAMANO = { sm: 'modal-sm', md: '', lg: 'modal-lg' };

export default function Modal({ titulo, onCerrar, tamano = 'md', children }) {
  const idTitulo = useId();
  const ventana = useRef(null);
  const cerrarRef = useRef(onCerrar);   // siempre apunta a la versión más reciente de onCerrar
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    cerrarRef.current = onCerrar;
  });

  useEffect(() => {
    const elementoPrevio = document.activeElement;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';   // la página de atrás no se desplaza

    // Activa la animación de entrada
    const cuadro = requestAnimationFrame(() => setVisible(true));

    // El foco pasa al primer campo del contenido (o a la ventana si no hay ninguno)
    const dentro = ventana.current.querySelector('.modal-body');
    (dentro.querySelector(ENFOCABLES) ?? ventana.current).focus();

    const alTeclear = (e) => {
      if (e.key === 'Escape') {
        cerrarRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      // Atrapa el foco dentro de la ventana
      const items = [...ventana.current.querySelectorAll(ENFOCABLES)];
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const primero = items[0];
      const ultimo = items[items.length - 1];
      const activo = document.activeElement;

      if (e.shiftKey && (activo === primero || activo === ventana.current)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alTeclear);

    return () => {
      cancelAnimationFrame(cuadro);
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = overflowPrevio;
      elementoPrevio?.focus?.();   // devuelve el foco a quien abrió el modal
    };
  }, []);

  // createPortal dibuja el modal directamente en <body>, fuera de la estructura de la página,
  // para que ningún contenedor lo recorte ni lo tape.
  return createPortal(
    <div
      className={`overlay ${visible ? 'show' : ''}`}
      // Solo cierra si el clic fue sobre el fondo oscuro, no sobre la ventana
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={ventana}
        className={`modal ${CLASE_TAMANO[tamano] ?? ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
      >
        <div className="modal-head">
          <h3 id={idTitulo}>{titulo}</h3>
          <button type="button" className="modal-close" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}