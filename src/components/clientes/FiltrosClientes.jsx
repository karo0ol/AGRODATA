// FiltrosClientes: barra de búsqueda y filtros de la lista de clientes (SYS-FR-013).
//   - Busca por nombre o NIT.
//   - Filtra por zona, tipo (B2B / B2C) y estado.
//
// PROPS:
//   valores:    { busqueda, zona, tipo, estado }   (texto vacío = sin filtro)
//   zonas:      arreglo de zonas para la lista desplegable
//   onCambiar:  función (campo, valor), por ejemplo onCambiar('zona', 'Chiquinquirá')
//   onLimpiar:  función opcional; si la das, aparece el botón "Limpiar" cuando hay algún filtro activo

import { Search, X } from 'lucide-react';
import Boton from '../ui/Boton.jsx';

export default function FiltrosClientes({ valores, zonas, onCambiar, onLimpiar }) {
  const { busqueda, zona, tipo, estado } = valores;
  const hayFiltros = busqueda !== '' || zona !== '' || tipo !== '' || estado !== '';

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="search-wrap">
          <Search />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => onCambiar('busqueda', e.target.value)}
            placeholder="Buscar por nombre o NIT"
            aria-label="Buscar cliente por nombre o NIT"
          />
        </div>

        <select
          className="month-select"
          value={zona}
          onChange={(e) => onCambiar('zona', e.target.value)}
          aria-label="Filtrar por zona"
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => <option key={z} value={z}>{z}</option>)}
        </select>

        <select
          className="month-select"
          value={tipo}
          onChange={(e) => onCambiar('tipo', e.target.value)}
          aria-label="Filtrar por tipo de cliente"
        >
          <option value="">B2B y B2C</option>
          <option value="B2B">B2B</option>
          <option value="B2C">B2C</option>
        </select>

        <select
          className="month-select"
          value={estado}
          onChange={(e) => onCambiar('estado', e.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Potencial">Potencial</option>
        </select>

        {onLimpiar && hayFiltros && (
          <Boton variante="contorno" tamano="sm" icono={X} onClick={onLimpiar}>
            Limpiar
          </Boton>
        )}
      </div>
    </div>
  );
}