// Clientes: lista de clientes con búsqueda y filtros (M2 · SYS-FR-008, 013, 017).
//   - Busca por nombre o NIT, y filtra por zona, tipo (B2B/B2C) y estado.  (SYS-FR-013)
//   - Muestra cada documento como "cargado" o "sin cargar".               (SYS-FR-017)
//   - "Nuevo cliente" abre el formulario en una ventana.                  (SYS-FR-008)
//   - Al hacer clic en una fila abre la ficha: /clientes/:id              (ClienteDetalle)
//
// FORMA DE LOS DATOS (src/data/clientes.js, array):
//   { id, nombre, nit, zona, departamento, municipio, tipo: 'B2B' | 'B2C',
//     estado: 'Activo' | 'Inactivo' | 'Potencial',
//     documentos: { rut: true/false, camara: true/false, cedula: true/false, banco: true/false } }

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { clientes as clientesIniciales } from '../data/clientes.js';
import Modal from '../components/ui/Modal.jsx';
import FormularioCliente from '../components/clientes/FormularioCliente.jsx';
import FiltrosClientes from '../components/clientes/FiltrosClientes.jsx';


const POR_PAGINA = 10;

// Etiqueta corta de cada documento y color de la insignia según el estado del cliente
const DOCUMENTOS = [
  { clave: 'rut', etiqueta: 'RUT' },
  { clave: 'camara', etiqueta: 'Cámara' },
  { clave: 'cedula', etiqueta: 'Cédula' },
  { clave: 'banco', etiqueta: 'Banco' },
];
const COLOR_ESTADO = { Activo: 'pill-verde', Inactivo: 'pill-gris', Potencial: 'pill-amarillo' };

export default function Clientes() {
  const navigate = useNavigate();
  const mostrarToast = useToast();

  // La lista vive en el estado para que un cliente nuevo aparezca de inmediato
  const [lista, setLista] = useState(clientesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [zona, setZona] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [verFormulario, setVerFormulario] = useState(false);

  // Zonas disponibles, sacadas de los mismos clientes (sin repetir)
  const zonas = [...new Set(lista.map((c) => c.zona))].sort();

  // ----- FILTRADO -----
  const texto = busqueda.trim().toLowerCase();
  const numeros = texto.replace(/\D/g, '');   // solo dígitos, para buscar el NIT con o sin puntos y guion
  const filtrados = lista.filter(
    (c) =>
      (texto === '' ||
        c.nombre.toLowerCase().includes(texto) ||
        (numeros !== '' && c.nit.replace(/\D/g, '').includes(numeros))) &&
      (zona === '' || c.zona === zona) &&
      (tipo === '' || c.tipo === tipo) &&
      (estado === '' || c.estado === estado),
  );

  // ----- PAGINACIÓN -----
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  // Cada vez que cambia un filtro se vuelve a la página 1
const cambiarFiltro = (campo, valor) => {
  const setters = { busqueda: setBusqueda, zona: setZona, tipo: setTipo, estado: setEstado };
  setters[campo](valor);
  setPagina(1);
};

const limpiarFiltros = () => {
  setBusqueda('');
  setZona('');
  setTipo('');
  setEstado('');
  setPagina(1);
};

  // Lo llama FormularioCliente al guardar: recibe el cliente ya armado (con id)
  const guardarCliente = (nuevo) => {
    setLista([nuevo, ...lista]);
    setVerFormulario(false);
    mostrarToast('Cliente creado correctamente');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Clientes</h2>
          <div className="subtitle">{filtrados.length} de {lista.length} clientes</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setVerFormulario(true)}>
          <Plus size={16} /> Nuevo cliente
        </button>
      </div>

            {/* ----- BÚSQUEDA Y FILTROS ----- */}
      <FiltrosClientes
        valores={{ busqueda, zona, tipo, estado }}
        zonas={zonas}
        onCambiar={cambiarFiltro}
        onLimpiar={limpiarFiltros}
      />

      {/* ----- TABLA ----- */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>NIT</th>
                <th>Zona</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Documentos</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr><td colSpan={6}>No se encontraron clientes con esos criterios.</td></tr>
              )}
              {visibles.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/clientes/${c.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <strong>{c.nombre}</strong>
                    <div className="cr-code">{c.municipio}, {c.departamento}</div>
                  </td>
                  <td>{c.nit}</td>
                  <td>{c.zona}</td>
                  <td>{c.tipo}</td>
                  <td><span className={`pill ${COLOR_ESTADO[c.estado]}`}>{c.estado}</span></td>
                  <td>
                    {/* SYS-FR-017: cada documento se ve como cargado o sin cargar, sin abrirlo */}
                    <div className="chip-row">
                      {DOCUMENTOS.map((d) => (
                        <span
                          key={d.clave}
                          className={`pill ${c.documentos[d.clave] ? 'pill-verde' : 'pill-gris'}`}
                          title={`${d.etiqueta}: ${c.documentos[d.clave] ? 'cargado' : 'sin cargar'}`}
                        >
                          {d.etiqueta} {c.documentos[d.clave] ? '✓' : '—'}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ----- PAGINACIÓN ----- */}
        {totalPaginas > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={n === paginaActual ? 'active' : ''}
                onClick={() => setPagina(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ----- VENTANA DEL FORMULARIO (Nuevo cliente) ----- */}
      {verFormulario && (
        <Modal titulo="Nuevo cliente" onCerrar={() => setVerFormulario(false)}>
          <FormularioCliente onGuardar={guardarCliente} onCancelar={() => setVerFormulario(false)} />
        </Modal>
      )}
    </>
  );
}