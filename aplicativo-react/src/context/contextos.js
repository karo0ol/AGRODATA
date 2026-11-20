// Los tres contextos de la app. Están en un archivo aparte (y no dentro de cada Provider)
// para que "Fast Refresh" de Vite funcione bien: un archivo .jsx debe exportar solo componentes.
//
//   ToastContext    -> avisos flotantes          (Provider: ToastContext.jsx)
//   ConexionContext -> en línea / sin conexión   (Provider: ConexionContext.jsx)
//   AuthContext     -> sesión del RTC            (Provider: AuthContext.jsx)
//   DatosContext    -> ventas y oportunidades    (Provider: DatosContext.jsx)
//
// Los componentes NO usan esto directo: usan los hooks de src/hooks/ (useToast, useConexion, useAuth).

import { createContext } from 'react';

export const ToastContext = createContext(null);
export const ConexionContext = createContext(null);
export const AuthContext = createContext(null);
export const DatosContext = createContext(null);
