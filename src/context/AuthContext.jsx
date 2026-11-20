// AuthContext: sesión del RTC (SIMULADA para el prototipo).
//
// useAuth() devuelve:
//   usuario                          { nombre, correo } o null si no hay sesión
//   iniciarSesion(correo, clave)     → { ok: true } | { ok: false, error }
//   registrar({ nombre, correo, clave })  → { ok: true } | { ok: false, error }
//   verificarCorreo(correo)          marca la cuenta como verificada
//   cambiarClave(correo, claveNueva) → { ok: true } | { ok: false, error }   (recuperar contraseña)
//   cerrarSesion()
//
// PERFIL (M1 · SYS-FR-094 a 096), solo se usan con la sesión iniciada:
//   actualizarPerfil({ nombre })           → { ok: true } | { ok: false, error }
//   correoPendiente                        correo nuevo que espera confirmación (o null)
//   solicitarCambioCorreo(correoNuevo)     → { ok: true } | { ok: false, error }
//   confirmarCambioCorreo()                aplica el correo pendiente (simula el clic en el enlace)
//   cancelarCambioCorreo()                 descarta el correo pendiente
//   cambiarClaveConSesion({ actual, nueva }) → { ok: true } | { ok: false, error }
//
// CUENTA DE PRUEBA:  demo@agrodata.co  /  Agro2026
//
// Las cuentas nuevas viven solo en memoria (al recargar la página se pierden) y la
// contraseña nunca se guarda en el dispositivo. Solo se recuerda la sesión abierta.
// TODO: reemplazar por llamadas reales al servidor cuando exista el backend.
//
// Sesión: se cierra tras 30 minutos sin actividad, pero SOLO con conexión
// (sin internet la sesión se mantiene abierta en el dispositivo).

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useConexion } from '../hooks/useConexion.js';
import { useToast } from '../hooks/useToast.js';
import { AuthContext } from './contextos.js';

const CLAVE_SESION = 'agrodata_sesion';
const MINUTOS_INACTIVIDAD = 30;
const EVENTOS_ACTIVIDAD = ['mousemove', 'keydown', 'click', 'touchstart'];

const CUENTAS_INICIALES = [
  { nombre: 'Usuario Demo', correo: 'demo@agrodata.co', clave: 'Agro2026', verificado: true },
];

const normalizarCorreo = (correo = '') => correo.trim().toLowerCase();

function leerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const { enLinea } = useConexion();
  const mostrarToast = useToast();

  const [usuario, setUsuario] = useState(leerSesion);
  const [correoPendiente, setCorreoPendiente] = useState(null);
  const cuentas = useRef(CUENTAS_INICIALES.map((c) => ({ ...c })));
  const temporizador = useRef(null);

  const buscarCuenta = (correo) =>
    cuentas.current.find((c) => c.correo === normalizarCorreo(correo));

  const cerrarSesion = useCallback(() => {
    setUsuario(null);
    setCorreoPendiente(null);
    localStorage.removeItem(CLAVE_SESION);
  }, []);

  // Guarda en pantalla y en el dispositivo los datos de la sesión abierta
  const guardarSesion = useCallback((datos) => {
    setUsuario(datos);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datos));
  }, []);

  const iniciarSesion = useCallback((correo, clave) => {
    const cuenta = buscarCuenta(correo);
    if (!cuenta || cuenta.clave !== clave) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }
    if (!cuenta.verificado) {
      return { ok: false, error: 'Primero debes verificar tu correo para poder ingresar.' };
    }
    guardarSesion({ nombre: cuenta.nombre, correo: cuenta.correo });
    return { ok: true };
  }, [guardarSesion]);

  const registrar = useCallback(({ nombre, correo, clave }) => {
    if (buscarCuenta(correo)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    cuentas.current.push({
      nombre: nombre.trim(),
      correo: normalizarCorreo(correo),
      clave,
      verificado: false,
    });
    return { ok: true };
  }, []);

  const verificarCorreo = useCallback((correo) => {
    const cuenta = buscarCuenta(correo);
    if (cuenta) cuenta.verificado = true;
  }, []);

  // Si el correo no existe responde igual que si existiera, para no revelar
  // qué correos están registrados (igual que el paso 1 de RecuperarContrasena).
  const cambiarClave = useCallback((correo, claveNueva) => {
    const cuenta = buscarCuenta(correo);
    if (cuenta) cuenta.clave = claveNueva;
    return { ok: true };
  }, []);

  // ---------- PERFIL (SYS-FR-094 a 096) ----------
  // La pantalla Perfil desactiva estas acciones sin conexión; aquí solo se valida el dato.

  const ERROR_SIN_CUENTA = {
    ok: false,
    error: 'No se encontró tu cuenta en este prototipo. Cierra sesión e ingresa de nuevo.',
  };

  // SYS-SEC-003: mínimo 8 caracteres con letras y números
  const claveValida = (clave) => clave.length >= 8 && /[a-zA-Z]/.test(clave) && /\d/.test(clave);

  // SYS-FR-094: editar el nombre del RTC
  const actualizarPerfil = useCallback(({ nombre }) => {
    const cuenta = usuario && buscarCuenta(usuario.correo);
    if (!cuenta) return ERROR_SIN_CUENTA;

    const limpio = nombre.trim();
    if (limpio.length < 2) {
      return { ok: false, error: 'Escribe tu nombre (mínimo 2 caracteres).' };
    }
    cuenta.nombre = limpio;
    guardarSesion({ nombre: limpio, correo: cuenta.correo });
    return { ok: true };
  }, [usuario, guardarSesion]);

  // SYS-FR-095, paso 1: se "envía" el enlace al correo NUEVO.
  // El correo actual sigue siendo el de la cuenta hasta que se confirme.
  const solicitarCambioCorreo = useCallback((correoNuevo) => {
    const nuevo = normalizarCorreo(correoNuevo);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevo)) {
      return { ok: false, error: 'Escribe un correo válido, por ejemplo nombre@correo.com.' };
    }
    if (usuario && nuevo === usuario.correo) {
      return { ok: false, error: 'Ese ya es el correo de tu cuenta.' };
    }
    // Mensaje genérico para no revelar qué correos están registrados
    if (buscarCuenta(nuevo)) {
      return { ok: false, error: 'Ese correo no está disponible. Prueba con otro.' };
    }
    setCorreoPendiente(nuevo);
    return { ok: true };
  }, [usuario]);

  // SYS-FR-095, paso 2: en el sistema real es el clic en el enlace del correo nuevo
  const confirmarCambioCorreo = useCallback(() => {
    const cuenta = usuario && buscarCuenta(usuario.correo);
    if (!cuenta || !correoPendiente) return ERROR_SIN_CUENTA;
    if (buscarCuenta(correoPendiente)) {
      setCorreoPendiente(null);
      return { ok: false, error: 'Ese correo ya no está disponible. Solicita el cambio con otro.' };
    }
    cuenta.correo = correoPendiente;
    cuenta.verificado = true;
    guardarSesion({ nombre: cuenta.nombre, correo: cuenta.correo });
    setCorreoPendiente(null);
    return { ok: true };
  }, [usuario, correoPendiente, guardarSesion]);

  const cancelarCambioCorreo = useCallback(() => setCorreoPendiente(null), []);

  // SYS-FR-096: cambiar la contraseña con la sesión iniciada (pide la actual)
  const cambiarClaveConSesion = useCallback(({ actual, nueva }) => {
    const cuenta = usuario && buscarCuenta(usuario.correo);
    if (!cuenta) return ERROR_SIN_CUENTA;

    if (cuenta.clave !== actual) {
      return { ok: false, error: 'La contraseña actual no es correcta.' };
    }
    if (!claveValida(nueva)) {
      return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres, con letras y números.' };
    }
    if (nueva === actual) {
      return { ok: false, error: 'La nueva contraseña debe ser distinta de la actual.' };
    }
    cuenta.clave = nueva;
    return { ok: true };
  }, [usuario]);

  // Cierre de sesión por inactividad: solo aplica con conexión
  useEffect(() => {
    const limpiar = () => clearTimeout(temporizador.current);

    if (!usuario || !enLinea) {
      limpiar();
      return undefined;
    }

    const reiniciar = () => {
      limpiar();
      temporizador.current = setTimeout(() => {
        cerrarSesion();
        mostrarToast.advertencia('Tu sesión se cerró por inactividad');
      }, MINUTOS_INACTIVIDAD * 60 * 1000);
    };

    reiniciar();
    EVENTOS_ACTIVIDAD.forEach((ev) => window.addEventListener(ev, reiniciar));
    return () => {
      limpiar();
      EVENTOS_ACTIVIDAD.forEach((ev) => window.removeEventListener(ev, reiniciar));
    };
  }, [usuario, enLinea, cerrarSesion, mostrarToast]);

  const valor = useMemo(
    () => ({
      usuario,
      iniciarSesion,
      registrar,
      verificarCorreo,
      cambiarClave,
      cerrarSesion,
      actualizarPerfil,
      correoPendiente,
      solicitarCambioCorreo,
      confirmarCambioCorreo,
      cancelarCambioCorreo,
      cambiarClaveConSesion,
    }),
    [
      usuario,
      iniciarSesion,
      registrar,
      verificarCorreo,
      cambiarClave,
      cerrarSesion,
      actualizarPerfil,
      correoPendiente,
      solicitarCambioCorreo,
      confirmarCambioCorreo,
      cancelarCambioCorreo,
      cambiarClaveConSesion,
    ],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
