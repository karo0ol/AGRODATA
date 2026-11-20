// IndicadorConexion: píldora de la barra superior que muestra si hay internet.
//   - Verde "En línea" / roja "Sin conexión" (clases conn-indicator del prototipo).
//   - Si hay cambios guardados en el celular sin enviar, muestra cuántos (decisión 10.1).
//   - Es un <button> para poder usarlo con teclado. En el prototipo, al hacer clic
//     se simula perder o recuperar la conexión.
//
// No recibe props: lee todo de useConexion(), que debe devolver
//   { enLinea: true | false,
//     pendientes: número de cambios sin enviar,
//     alternarConexion: función que cambia entre en línea y sin conexión }

import { useConexion } from '../../hooks/useConexion.js';

export default function IndicadorConexion() {
  const { enLinea, pendientes, alternarConexion } = useConexion();

  return (
    <button
      type="button"
      className={`conn-indicator ${enLinea ? 'online' : 'offline'}`}
      onClick={alternarConexion}
      aria-label={
        enLinea
          ? 'Estado de conexión: en línea. Clic para simular que no hay conexión.'
          : 'Estado de conexión: sin conexión. Clic para simular que vuelve la conexión.'
      }
      title={enLinea ? 'Simular pérdida de conexión' : 'Simular regreso de la conexión'}
    >
      <span className="conn-dot" aria-hidden="true" />
      {enLinea ? 'En línea' : 'Sin conexión'}

      {/* Cambios guardados localmente que se enviarán al recuperar internet */}
      {pendientes > 0 && (
        <span className="conn-pending">· {pendientes} por enviar</span>
      )}
    </button>
  );
}