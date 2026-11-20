// MapaCliente: mapa con la ubicación del cliente (M2 · SYS-FR-020).
// Se muestra dentro de una ventana (Modal) desde la ficha del cliente.
//
// PROPS:
//   cliente: { nombre, municipio, departamento, latitud?, longitud? }
//
// En el prototipo usa un mapa de OpenStreetMap incrustado, centrado en el municipio
// del cliente (ejemplo). El proveedor de mapas real aún está por definir.
// Necesita internet (decisión 10.1).

import { ExternalLink, MapPinOff } from 'lucide-react';
import { ubicacionDeCliente } from '../../data/ubicaciones.js';
import Boton from '../ui/Boton.jsx';

export default function MapaCliente({ cliente }) {
  const ubicacion = ubicacionDeCliente(cliente);

  if (!ubicacion) {
    return (
      <p className="vc-meta" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <MapPinOff size={16} aria-hidden="true" /> Este cliente aún no tiene ubicación guardada.
      </p>
    );
  }

  const { latitud, longitud } = ubicacion;
  const margen = 0.03;   // qué tan "cerca" se ve el mapa
  const area = [longitud - margen, latitud - margen, longitud + margen, latitud + margen].join('%2C');

  const incrustado =
    `https://www.openstreetmap.org/export/embed.html?bbox=${area}&layer=mapnik&marker=${latitud}%2C${longitud}`;
  const enlace = `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}#map=14/${latitud}/${longitud}`;

  return (
    <>
      <p className="vc-meta" style={{ marginBottom: 10 }}>
        {cliente.municipio}, {cliente.departamento} · Ubicación de ejemplo (centro del municipio).
      </p>

      <iframe
        title={`Mapa de ${cliente.nombre}`}
        src={incrustado}
        style={{ width: '100%', height: 320, border: '1px solid #ece7d9', borderRadius: 12 }}
        loading="lazy"
      />

      <div style={{ marginTop: 12 }}>
        <a href={enlace} target="_blank" rel="noreferrer">
          <Boton variante="contorno" tamano="sm" icono={ExternalLink} tabIndex={-1}>
            Abrir en una pestaña nueva
          </Boton>
        </a>
      </div>
    </>
  );
}
