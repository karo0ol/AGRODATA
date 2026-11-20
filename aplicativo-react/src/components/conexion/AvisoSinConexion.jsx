// AvisoSinConexion: franja amarilla que se muestra SOLO cuando no hay internet.
// Úsala en las pantallas con funciones que sí necesitan conexión
// (decisión 10.1: documentos, importaciones y mapa).
//
// PROPS:
//   children: texto del aviso (opcional). Si no lo das, muestra uno genérico.
//
// Cuando hay internet no dibuja nada.
//
// Ejemplos:
//   <AvisoSinConexion />
//   <AvisoSinConexion>Los documentos del cliente necesitan internet.</AvisoSinConexion>
//
// useConexion debe devolver { enLinea: true | false }.

import { WifiOff } from 'lucide-react';
import { useConexion } from '../../hooks/useConexion.js';

export default function AvisoSinConexion({ children }) {
  const { enLinea } = useConexion();

  if (enLinea) return null;

  return (
    <div className="banner-warn" role="status">
      <WifiOff size={18} style={{ flexShrink: 0 }} aria-hidden="true" />
      <span>
        {children ??
          'Esta función necesita internet. Tus datos siguen disponibles y los cambios se guardan en tu dispositivo para enviarse cuando vuelva la conexión.'}
      </span>
    </div>
  );
}