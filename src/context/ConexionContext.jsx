// ConexionContext: estado de la conexión a internet y cambios guardados sin enviar.
//
// useConexion() devuelve:
//   enLinea            true = hay internet · false = sin conexión
//   pendientes         NÚMERO de cambios guardados en el celular que aún no se envían
//   alternarConexion() en el prototipo, simula perder o recuperar la conexión
//                      (es lo que hace el botón de la barra superior)
//   agregarPendiente(operacion)  guarda un cambio para enviarlo cuando vuelva el internet
//
// Al volver la conexión, los pendientes se "envían" (simulado) y se avisa con un toast.
// Decisión 10.1: sin conexión el RTC consulta y registra; documentos, importaciones y mapa
// siguen necesitando internet.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../hooks/useToast.js';
import { ConexionContext } from './contextos.js';

const CLAVE_PENDIENTES = 'agrodata_pendientes';

function leerPendientes() {
  try {
    const guardado = localStorage.getItem(CLAVE_PENDIENTES);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
}

export function ConexionProvider({ children }) {
  const mostrarToast = useToast();

  const [enLinea, setEnLinea] = useState(() => navigator.onLine);
  const [cola, setCola] = useState(leerPendientes);

  // Para avisar solo cuando CAMBIA la conexión (no al cargar la página)
  const anterior = useRef(enLinea);

  // Cuando el dispositivo realmente gana o pierde internet
  useEffect(() => {
    const alConectar = () => setEnLinea(true);
    const alDesconectar = () => setEnLinea(false);
    window.addEventListener('online', alConectar);
    window.addEventListener('offline', alDesconectar);
    return () => {
      window.removeEventListener('online', alConectar);
      window.removeEventListener('offline', alDesconectar);
    };
  }, []);

  // Aviso al cambiar de estado
  useEffect(() => {
    if (anterior.current === enLinea) return;
    anterior.current = enLinea;
    if (enLinea) {
      mostrarToast.exito('Conexión recuperada');
    } else {
      mostrarToast.advertencia('Sin conexión: tus cambios se guardarán en el dispositivo');
    }
  }, [enLinea, mostrarToast]);

  // La cola se guarda en el dispositivo
  useEffect(() => {
    localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(cola));
  }, [cola]);

  // Al haber internet y cambios pendientes, se "envían" (simulado)
  useEffect(() => {
    if (!enLinea || cola.length === 0) return undefined;
    const t = setTimeout(() => {
      // TODO: aquí iría el envío real al servidor
      mostrarToast(`${cola.length} cambio(s) enviado(s) al servidor`);
      setCola([]);
    }, 800);
    return () => clearTimeout(t);
  }, [enLinea, cola, mostrarToast]);

  const alternarConexion = useCallback(() => setEnLinea((v) => !v), []);

  const agregarPendiente = useCallback((operacion) => {
    setCola((prev) => [
      ...prev,
      { ...operacion, idLocal: crypto.randomUUID(), creadoEn: new Date().toISOString() },
    ]);
  }, []);

  const valor = useMemo(
    () => ({ enLinea, pendientes: cola.length, alternarConexion, agregarPendiente }),
    [enLinea, cola.length, alternarConexion, agregarPendiente],
  );

  return <ConexionContext.Provider value={valor}>{children}</ConexionContext.Provider>;
}
