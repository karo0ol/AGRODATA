// VistaPreviaImportacion: resumen y tabla de lo que se va a importar.
//
// PROPS:
//   resumen: { nuevas, omitidas, errores, clientesNuevos, productosNuevos }
//   filas:   [{ fila, cliente, producto, fecha, estado: 'Nueva' | 'Omitida' | 'Con error', motivo }]
//
// Solo se dibujan las primeras 100 filas para que la pantalla no se ponga lenta;
// el resumen sí cuenta todas.

const MAX_FILAS = 100;
const COLOR_ESTADO = { 'Nueva': 'pill-verde', 'Omitida': 'pill-gris', 'Con error': 'pill-rojo' };

export default function VistaPreviaImportacion({ resumen, filas }) {
  const visibles = filas.slice(0, MAX_FILAS);

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="st-label">Ventas nuevas</div>
          <div className="st-val">{resumen.nuevas}</div>
        </div>
        <div className="stat-card">
          <div className="st-label">Omitidas (ya existen)</div>
          <div className="st-val">{resumen.omitidas}</div>
        </div>
        <div className="stat-card">
          <div className="st-label">Con error</div>
          <div className="st-val">{resumen.errores}</div>
        </div>
        <div className="stat-card">
          <div className="st-label">Clientes / productos nuevos</div>
          <div className="st-val">{resumen.clientesNuevos} / {resumen.productosNuevos}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Fila</th><th>Cliente</th><th>Producto</th><th>Fecha</th><th>Resultado</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.fila}>
                <td>{f.fila}</td>
                <td>{f.cliente}</td>
                <td>{f.producto}</td>
                <td>{f.fecha || '—'}</td>
                <td><span className={`pill ${COLOR_ESTADO[f.estado]}`}>{f.estado}</span></td>
                <td>{f.motivo || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filas.length > MAX_FILAS && (
        <p className="vc-meta">Se muestran las primeras {MAX_FILAS} de {filas.length} filas.</p>
      )}
    </>
  );
}