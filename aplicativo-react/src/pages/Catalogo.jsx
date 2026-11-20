// Catalogo: productos que el RTC ofrece a sus clientes (M5).
//   - Consultar los productos del catálogo, con búsqueda por nombre.
//   - Editar el precio unitario de cada producto (decisión 10.2).
//     El precio lo define el RTC; mientras no lo digite, el campo queda vacío.
//   - Los cambios de precio NO modifican las ventas ya registradas:
//     cada venta guarda el precio que se usó el día que se registró.
//
// FORMA DE LOS DATOS:
//   productos: { id, nombre, unidad, referencia?, precio? }
//   (precio puede faltar o ser null si el RTC todavía no lo ha digitado)

import { useState } from 'react';
import { Search, Pencil, Check, X } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { productos as productosIniciales } from '../data/productos.js';

const formatoPesos = (n) => '$' + n.toLocaleString('es-CO');

export default function Catalogo() {
  const mostrarToast = useToast();

  const [lista, setLista] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);   // producto cuyo precio se está editando
  const [valor, setValor] = useState('');                // texto que escribe el RTC
  const [error, setError] = useState('');

  const sinPrecio = lista.filter((p) => p.precio == null).length;

  const filtrados = lista.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()),
  );

  const empezarEdicion = (p) => {
    setEditandoId(p.id);
    setValor(p.precio == null ? '' : String(p.precio));
    setError('');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setValor('');
    setError('');
  };

  const guardarPrecio = (id) => {
    // Vacío = el producto queda sin precio (el valor de sus ventas no se calcula)
    const texto = valor.trim();
    const precio = texto === '' ? null : Number(texto);

    if (precio !== null && (Number.isNaN(precio) || precio < 0)) {
      setError('Escribe un precio válido (un número mayor o igual a 0).');
      return;
    }

    setLista(lista.map((p) => (p.id === id ? { ...p, precio } : p)));
    cancelarEdicion();
    mostrarToast(precio === null ? 'Precio eliminado' : 'Precio actualizado correctamente');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Catálogo</h2>
          <div className="subtitle">
            {lista.length} productos · {sinPrecio} sin precio
          </div>
        </div>
      </div>

      {sinPrecio > 0 && (
        <div className="banner-warn">
          Hay <strong>{sinPrecio}</strong> producto(s) sin precio. Las ventas de esos productos se
          registran, pero su valor total no se calcula hasta que digites el precio.
        </div>
      )}

      {/* ----- BÚSQUEDA ----- */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <Search />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar producto por nombre"
              aria-label="Buscar producto"
            />
          </div>
        </div>
      </div>

      {/* ----- TABLA ----- */}
      <div className="card">
        {error && <div className="banner-warn" role="alert">{error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Referencia</th>
                <th>Unidad</th>
                <th>Precio unitario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr><td colSpan={5}>No hay productos que coincidan con la búsqueda.</td></tr>
              )}

              {filtrados.map((p) => {
                const editando = editandoId === p.id;
                return (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.referencia ?? '—'}</td>
                    <td>{p.unidad ?? '—'}</td>
                    <td>
                      {editando ? (
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={valor}
                          onChange={(e) => setValor(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') guardarPrecio(p.id);
                            if (e.key === 'Escape') cancelarEdicion();
                          }}
                          placeholder="Precio en pesos"
                          aria-label={`Precio unitario de ${p.nombre}`}
                          autoFocus
                          style={{ maxWidth: 160 }}
                        />
                      ) : p.precio == null ? (
                        <span className="pill pill-gris">Sin precio</span>
                      ) : (
                        formatoPesos(p.precio)
                      )}
                    </td>
                    <td>
                      {editando ? (
                        <div className="vc-actions">
                          <button type="button" className="btn btn-sm btn-primary" onClick={() => guardarPrecio(p.id)}>
                            <Check size={14} /> Guardar
                          </button>
                          <button type="button" className="btn btn-sm btn-outline" onClick={cancelarEdicion}>
                            <X size={14} /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <button type="button" className="btn btn-sm btn-outline" onClick={() => empezarEdicion(p)}>
                          <Pencil size={14} /> Editar precio
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}