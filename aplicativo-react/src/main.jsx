// main.jsx es el PUNTO DE ENTRADA de la aplicación: lo primero que ejecuta Vite.
// Su trabajo es "enganchar" React al <div id="root"> que está en index.html.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ---------- ESTILOS ----------
// Se importan aquí una sola vez y aplican a TODA la aplicación.
// El orden importa: extras.css va después para poder ajustar cosas de styles.css.
import './styles/styles.css';   // el CSS de tu prototipo, sin cambios
import './styles/extras.css';   // estilos nuevos: responsive, mensajes de error, barra móvil

// ---------- COMPONENTE PRINCIPAL ----------
import App from './App.jsx';

// ---------- PROVIDERS (contextos globales) ----------
// Un Provider "envuelve" la aplicación para que cualquier componente de adentro
// pueda leer sus datos sin pasarlos de padre a hijo.
import { ToastProvider } from './context/ToastContext.jsx';       // avisos flotantes
import { ConexionProvider } from './context/ConexionContext.jsx'; // en línea / sin conexión
import { AuthProvider } from './context/AuthContext.jsx';         // sesión del RTC (simulada)
import { DatosProvider } from './context/DatosContext.jsx';     // ventas y oportunidades compartidas

createRoot(document.getElementById('root')).render(
  // StrictMode solo ayuda a detectar errores mientras desarrollas; no se ve en pantalla.
  <StrictMode>
    {/*
      EL ORDEN DE LOS PROVIDERS IMPORTA (cada uno solo puede usar a los que lo envuelven):
      - ToastProvider va primero: no depende de nadie.
      - ConexionProvider usa los avisos (Toast), así que va dentro de ToastProvider.
      - DatosProvider no depende de nadie: va por dentro para que cualquier pantalla lo use.
      - AuthProvider usa la conexión (cierre por inactividad solo con internet y
        revalidación de la sesión al recuperarlo) y los avisos, así que va dentro de ambos.
    */}
    <ToastProvider>
      <ConexionProvider>
        <AuthProvider>
          <DatosProvider>
            <App />
          </DatosProvider>
        </AuthProvider>
      </ConexionProvider>
    </ToastProvider>
  </StrictMode>,
);