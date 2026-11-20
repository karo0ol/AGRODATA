// Prospectos: clientes potenciales aún no convertidos (M2 · SYS-FR-021 a 025).
//   - Registro con información comercial y ubicación.                     (SYS-FR-021)
//   - Clasificación por modelo de negocio y sector.                        (SYS-FR-022)
//   - Impide registrar prospectos duplicados.                              (SYS-FR-023)
//   - Registro de contactos y seguimientos de cada prospecto.              (SYS-FR-024)
//   - Conversión a cliente conservando datos y seguimientos.               (SYS-FR-025)
//
// FORMA DE LOS DATOS (src/data/prospectos.js, array):
//   { id, nombre, contacto, telefono, modeloNegocio, sector, departamento, municipio,
//     seguimientos: [{ fecha: 'AAAA-MM-DD', nota }] }
//
// Y de src/data/catalogos.js se usan estas listas:
//   departamentos: ['Cundinamarca', ...]
//   municipiosPorDepartamento: { Cundinamarca: ['Facatativá', ...], ... }
//   modelosNegocio: ['B2B', 'B2C', ...]      sectores: ['Flores', 'Café', ...]

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MessageSquarePlus, UserCheck } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { prospectos as prospectosIniciales } from '../data/prospectos.js';
import { departamentos, municipiosPorDepartamento, modelosNegocio, sectores } from '../data/catalogos.js';
import Modal from '../components/ui/Modal.jsx';

// Formulario vacío: se usa al abrir "Nuevo prospecto"
const VACIO = {
  nombre: '', contacto: '', telefono: '',
  modeloNegocio: '', sector: '', departamento: '', municipio: '',
};

// Para comparar nombres sin importar mayúsculas, tildes ni espacios sobrantes
const normalizar = (t) =>
  t.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');

export default function Prospectos() {
  const navigate = useNavigate();
  const mostrarToast = useToast();

  const [lista, setLista] = useState(prospectosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [modelo, setModelo] = useState('');
  const [sector, setSector] = useState('');

  const [verFormulario, setVerFormulario] = useState(false);
  const [datos, setDatos] = useState(VACIO);
  const [error, setError] = useState('');

  const [idSeguimiento, setIdSeguimiento] = useState(null);   // prospecto abierto en "Seguimientos"
  const [nota, setNota] = useState('');
  const [aConvertir, setAConvertir] = useState(null);         // prospecto que se va a convertir

  // El prospecto de seguimientos se busca en la lista para ver siempre sus datos al día
  const prospectoSeg = lista.find((p) => p.id === idSeguimiento);

  // ----- FILTRADO -----
  const texto = normalizar(busqueda);
  const filtrados = lista.filter(
    (p) =>
      (texto === '' || normalizar(p.nombre).includes(texto) || normalizar(p.contacto).includes(texto)) &&
      (modelo === '' || p.modeloNegocio === modelo) &&
      (sector === '' || p.sector === sector),
  );

  // ----- FORMULARIO -----
  const cambiarCampo = (campo) => (e) => {
    const valor = e.target.value;
    // Al cambiar de departamento se borra el municipio, porque ya no corresponde
    setDatos((d) => ({ ...d, [campo]: valor, ...(campo === 'departamento' ? { municipio: '' } : {}) }));
  };

  const abrirFormulario = () => {
    setDatos(VACIO);
    setError('');
    setVerFormulario(true);
  };

  const guardar = (e) => {
    e.preventDefault();

    // SYS-FR-023: no se permiten duplicados (mismo nombre o mismo teléfono)
    const duplicado = lista.find(
      (p) =>
        normalizar(p.nombre) === normalizar(datos.nombre) ||
        (datos.telefono.trim() !== '' && p.telefono.replace(/\D/g, '') === datos.telefono.replace(/\D/g, '')),
    );
    if (duplicado) {
      setError(`Ya existe un prospecto registrado como «${duplicado.nombre}». Revisa el nombre o el teléfono.`);
      return;
    }

    const nuevo = { ...datos, id: 'P' + Date.now(), seguimientos: [] };
    setLista([nuevo, ...lista]);
    setVerFormulario(false);
    mostrarToast('Prospecto registrado correctamente');
  };

  // ----- SEGUIMIENTOS (SYS-FR-024) -----
  const agregarSeguimiento = (e) => {
    e.preventDefault();
    if (nota.trim() === '') return;
    const hoy = new Date().toLocaleDateString('en-CA');
    setLista(lista.map((p) =>
      p.id === idSeguimiento
        ? { ...p, seguimientos: [{ fecha: hoy, nota: nota.trim() }, ...p.seguimientos] }
        : p,
    ));
    setNota('');
    mostrarToast('Seguimiento registrado');
  };

  // ----- CONVERSIÓN A CLIENTE (SYS-FR-025) -----
  const convertir = () => {
    const p = aConvertir;
    // Se arma el cliente con los datos del prospecto y se conservan sus seguimientos
    const cliente = {
      id: 'C' + Date.now(),
      nombre: p.nombre,
      nit: '',
      zona: p.municipio,
      departamento: p.departamento,
      municipio: p.municipio,
      tipo: p.modeloNegocio === 'B2C' ? 'B2C' : 'B2B',
      estado: 'Activo',
      documentos: { rut: false, camara: false, cedula: false, banco: false },
      ultimaVisita: new Date().toLocaleDateString('en-CA'),
      seguimientos: p.seguimientos,
    };
    console.log('Cliente creado desde prospecto:', cliente);   // en el prototipo no se guarda en un servidor
    setLista(lista.filter((x) => x.id !== p.id));
    setAConvertir(null);
    mostrarToast(`${p.nombre} ahora es cliente`);
    navigate('/clientes');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Prospectos</h2>
          <div className="subtitle">{filtrados.length} de {lista.length} prospectos</div>
        </div>
        <button type="button" className="btn btn-primary" onClick={abrirFormulario}>
          <Plus size={16} /> Nuevo prospecto
        </button>
      </div>

      {/* ----- BÚSQUEDA Y FILTROS ----- */}
      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-wrap">
            <Search />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o contacto"
              aria-label="Buscar prospecto"
            />
          </div>
          <select className="month-select" value={modelo} onChange={(e) => setModelo(e.target.value)} aria-label="Filtrar por modelo de negocio">
            <option value="">Todos los modelos</option>
            {modelosNegocio.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="month-select" value={sector} onChange={(e) => setSector(e.target.value)} aria-label="Filtrar por sector">
            <option value="">Todos los sectores</option>
            {sectores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ----- TABLA ----- */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prospecto</th><th>Modelo</th><th>Sector</th><th>Contacto</th><th>Seguimientos</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr><td colSpan={6}>No se encontraron prospectos con esos criterios.</td></tr>
              )}
              {filtrados.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.nombre}</strong>
                    <div className="cr-code">{p.municipio}, {p.departamento}</div>
                  </td>
                  <td><span className="pill pill-morado">{p.modeloNegocio}</span></td>
                  <td>{p.sector}</td>
                  <td>{p.contacto}<div className="cr-code">{p.telefono}</div></td>
                  <td>{p.seguimientos.length}</td>
                  <td>
                    <div className="vc-actions">
                      <button type="button" className="btn btn-sm btn-outline" onClick={() => setIdSeguimiento(p.id)}>
                        <MessageSquarePlus size={14} /> Seguimientos
                      </button>
                      <button type="button" className="btn btn-sm btn-dark" onClick={() => setAConvertir(p)}>
                        <UserCheck size={14} /> Convertir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ----- VENTANA: NUEVO PROSPECTO ----- */}
      {verFormulario && (
        <Modal titulo="Nuevo prospecto" onCerrar={() => setVerFormulario(false)}>
          <form onSubmit={guardar}>
            {error && <div className="banner-warn" role="alert">{error}</div>}

            <div className="form-grid">
              <div className="fld">
                <label htmlFor="pro-nombre">Empresa o finca *</label>
                <input id="pro-nombre" value={datos.nombre} onChange={cambiarCampo('nombre')} required />
              </div>
              <div className="fld">
                <label htmlFor="pro-contacto">Persona de contacto *</label>
                <input id="pro-contacto" value={datos.contacto} onChange={cambiarCampo('contacto')} required />
              </div>
              <div className="fld">
                <label htmlFor="pro-tel">Teléfono *</label>
                <input id="pro-tel" type="tel" value={datos.telefono} onChange={cambiarCampo('telefono')} required />
              </div>
              <div className="fld">
                <label htmlFor="pro-modelo">Modelo de negocio *</label>
                <select id="pro-modelo" value={datos.modeloNegocio} onChange={cambiarCampo('modeloNegocio')} required>
                  <option value="">Selecciona…</option>
                  {modelosNegocio.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="fld">
                <label htmlFor="pro-sector">Sector *</label>
                <select id="pro-sector" value={datos.sector} onChange={cambiarCampo('sector')} required>
                  <option value="">Selecciona…</option>
                  {sectores.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {/* Departamento y municipio salen de listas, sin texto libre (SYS-FR-009) */}
              <div className="fld">
                <label htmlFor="pro-depto">Departamento *</label>
                <select id="pro-depto" value={datos.departamento} onChange={cambiarCampo('departamento')} required>
                  <option value="">Selecciona…</option>
                  {departamentos.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="fld">
                <label htmlFor="pro-muni">Municipio *</label>
                <select id="pro-muni" value={datos.municipio} onChange={cambiarCampo('municipio')} required disabled={!datos.departamento}>
                  <option value="">{datos.departamento ? 'Selecciona…' : 'Primero elige el departamento'}</option>
                  {(municipiosPorDepartamento[datos.departamento] ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setVerFormulario(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar prospecto</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ----- VENTANA: SEGUIMIENTOS ----- */}
      {prospectoSeg && (
        <Modal titulo={`Seguimientos · ${prospectoSeg.nombre}`} onCerrar={() => { setIdSeguimiento(null); setNota(''); }}>
          <form onSubmit={agregarSeguimiento}>
            <div className="fld">
              <label htmlFor="seg-nota">Nuevo contacto o seguimiento</label>
              <textarea
                id="seg-nota"
                rows={3}
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder="¿Qué se habló o qué se acordó?"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={nota.trim() === ''}>Agregar</button>
            </div>
          </form>

          <div className="section-label" style={{ marginTop: 18 }}>Historial</div>
          {prospectoSeg.seguimientos.length === 0 && <p>Aún no hay seguimientos registrados.</p>}
          {prospectoSeg.seguimientos.map((s, i) => (
            <div className="timeline-item" key={i}>
              <div className="ti-dot"></div>
              <div>
                <div className="ti-title">{s.nota}</div>
                <div className="ti-date">{s.fecha}</div>
              </div>
            </div>
          ))}
        </Modal>
      )}

      {/* ----- VENTANA: CONFIRMAR CONVERSIÓN ----- */}
      {aConvertir && (
        <Modal titulo="Convertir en cliente" onCerrar={() => setAConvertir(null)}>
          <p style={{ marginBottom: 16 }}>
            <strong>{aConvertir.nombre}</strong> pasará a la lista de clientes conservando sus datos
            y sus {aConvertir.seguimientos.length} seguimiento(s). Después podrás completar su NIT y documentos.
          </p>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setAConvertir(null)}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={convertir}>Sí, convertir</button>
          </div>
        </Modal>
      )}
    </>
  );
}