// Tabla: tabla con desplazamiento lateral en pantallas angostas (table-wrap).
//
// PROPS:
//   columnas:     [{ clave, titulo, render? }]
//                   clave:  nombre del campo en cada fila
//                   titulo: encabezado de la columna
//                   render: función opcional (fila) => contenido, para celdas especiales
//   filas:        arreglo de objetos
//   claveFila:    campo único de cada fila para el "key" de React (por defecto 'id')
//   mensajeVacio: texto cuando no hay filas
//   etiqueta:     descripción de la tabla para lectores de pantalla (opcional)
//
// Ejemplo:
//   <Tabla
//     etiqueta="Ventas"
//     filas={ventas}
//     columnas={[
//       { clave: 'fecha', titulo: 'Fecha' },
//       { clave: 'valorTotal', titulo: 'Valor', render: (v) => formatoPesos(v.valorTotal) },
//     ]}
//   />

export default function Tabla({
  columnas,
  filas,
  claveFila = 'id',
  mensajeVacio = 'No hay datos para mostrar.',
  etiqueta,
}) {
  return (
    <div className="table-wrap">
      <table aria-label={etiqueta}>
        <thead>
          <tr>
            {columnas.map((c) => <th key={c.clave} scope="col">{c.titulo}</th>)}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 && (
            <tr><td colSpan={columnas.length}>{mensajeVacio}</td></tr>
          )}
          {filas.map((fila) => (
            <tr key={fila[claveFila]}>
              {columnas.map((c) => (
                <td key={c.clave}>{c.render ? c.render(fila) : (fila[c.clave] ?? '—')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}