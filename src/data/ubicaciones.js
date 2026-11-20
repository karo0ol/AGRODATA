// Ubicaciones de EJEMPLO para el mapa del prototipo.
// Son las coordenadas aproximadas del centro de cada municipio (no la finca real).
// Cuando exista el backend, cada cliente guardará su propia ubicación con el GPS
// del celular (SYS-FR-092): latitud, longitud y fecha de captura.

export const ubicacionesMunicipio = {
  'Facatativá':   { latitud: 4.8136, longitud: -74.3544 },
  'Espinal':      { latitud: 4.1494, longitud: -74.8835 },
  'Palmira':      { latitud: 3.5394, longitud: -76.3036 },
  'Ventaquemada': { latitud: 5.3644, longitud: -73.5206 },
  'Rionegro':     { latitud: 6.1552, longitud: -75.3737 },
  'Madrid':       { latitud: 4.7329, longitud: -74.2641 },
  'Chiquinquirá': { latitud: 5.6167, longitud: -73.8167 },
  'Ibagué':       { latitud: 4.4389, longitud: -75.2322 },
};

// Devuelve { latitud, longitud } del cliente, o null si no hay ubicación.
// Si el cliente ya trae latitud y longitud propias, se usan; si no, las del municipio.
export function ubicacionDeCliente(cliente) {
  if (cliente.latitud != null && cliente.longitud != null) {
    return { latitud: cliente.latitud, longitud: cliente.longitud };
  }
  return ubicacionesMunicipio[cliente.municipio] ?? null;
}
