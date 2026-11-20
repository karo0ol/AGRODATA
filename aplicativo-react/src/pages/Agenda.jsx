// Agenda: visitas organizadas por SEMANA DEL AÑO (M3 · SYS-FR-026 a 030).
//   - Muestra la semana elegida con sus visitas.                           (SYS-FR-027)
//   - "Nueva visita" programa una con fecha, semana y objetivo.            (SYS-FR-026)
//   - Panel con próximas actividades y compromisos pendientes.             (SYS-FR-028)
//   - Registrar el resultado de una visita, y desde ahí programar
//     la siguiente visita o seguimiento.                                   (SYS-FR-029 y 030)
//   (El calendario MENSUAL va en la pantalla Alertas, SYS-FR-081.)
//
// FORMA DE LOS DATOS:
//   visitas: { id, clienteId, objetivo, fecha, hora, estado: 'Programada' | 'Realizada',
//              semana, resultado?, notas? }
//   (si algún dato de prueba no trae "semana", aquí se calcula con semanaDelAnio)
//
// COMPONENTES QUE USA (carpeta components/agenda), con estas props:
//   <AgendaSemanal lunes visitas nombreCliente onRegistrarResultado />
//   <FormularioVisita onGuardar onCancelar />
//        onGuardar recibe { clienteId, objetivo, fecha, hora }
//   <FormularioResultadoVisita visita nombreCliente onGuardar onCancelar />
//        onGuardar recibe { resultado, notas, proximaFecha?, proximoObjetivo? }

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';
import { clientes } from '../data/clientes.js';
import { visitas as visitasIniciales } from '../data/visitas.js';
import { compromisos } from '../data/compromisos.js';
import { lunesDe, sumarDias, semanaDelAnio, formatoFecha } from '../utils/fechas.js';
import Modal from '../components/ui/Modal.jsx';
import AgendaSemanal from '../components/agenda/AgendaSemanal.jsx';
import FormularioVisita from '../components/agenda/FormularioVisita.jsx';
import FormularioResultadoVisita from '../components/agenda/FormularioResultadoVisita.jsx';

export default function Agenda() {
  const mostrarToast = useToast();

  const hoy = new Date().toLocaleDateString('en-CA');

  // La lista vive en el estado para que lo que se programe aparezca de inmediato
  const [lista, setLista] = useState(visitasIniciales);
  // La semana se identifica por su LUNES (AAAA-MM-DD). Empieza en la semana actual.
  const [lunes, setLunes] = useState(lunesDe(hoy));
  const [verFormulario, setVerFormulario] = useState(false);
  const [visitaResultado, setVisitaResultado] = useState(null);   // visita a la que se le registra el resultado

  const nombreCliente = (id) => clientes.find((c) => c.id === id)?.nombre ?? 'Cliente';

  // ----- SEMANA MOSTRADA -----
  const domingo = sumarDias(lunes, 6);
  const numeroSemana = semanaDelAnio(lunes);
  const anio = sumarDias(lunes, 3).slice(0, 4);   // el jueves decide a qué año pertenece la semana
  const visitasSemana = lista.filter((v) => v.fecha >= lunes && v.fecha <= domingo);

  // ----- PRÓXIMAS ACTIVIDADES (SYS-FR-028) -----
  const proximas = lista
    .filter((v) => v.estado === 'Programada' && v.fecha >= hoy)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
    .slice(0, 5);
  const pendientes = compromisos
    .filter((c) => c.estado === 'Pendiente')
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(0, 5);

  // ----- PROGRAMAR UNA VISITA (SYS-FR-026) -----
  const guardarVisita = (datos) => {
    const nueva = {
      ...datos,
      id: 'V' + Date.now(),
      estado: 'Programada',
      semana: semanaDelAnio(datos.fecha),
    };
    setLista([...lista, nueva]);
    setVerFormulario(false);
    // Si la visita cae en otra semana, se muestra esa semana para que el RTC la vea
    setLunes(lunesDe(datos.fecha));
    mostrarToast('Visita programada correctamente');
  };

  // ----- REGISTRAR EL RESULTADO (SYS-FR-029) Y PROGRAMAR LA SIGUIENTE (SYS-FR-030) -----
  const guardarResultado = (datos) => {
    const original = visitaResultado;

    // 1) La visita queda como realizada, con su resultado y notas
    let nuevaLista = lista.map((v) =>
      v.id === original.id
        ? { ...v, estado: 'Realizada', resultado: datos.resultado, notas: datos.notas }
        : v,
    );

    // 2) Si el RTC indicó una próxima fecha, se programa la siguiente visita
    if (datos.proximaFecha) {
      nuevaLista = [
        ...nuevaLista,
        {
          id: 'V' + Date.now(),
          clienteId: original.clienteId,
          objetivo: datos.proximoObjetivo || 'Seguimiento',
          fecha: datos.proximaFecha,
          hora: original.hora,
          estado: 'Programada',
          semana: semanaDelAnio(datos.proximaFecha),
        },
      ];
    }

    setLista(nuevaLista);
    setVisitaResultado(null);
    mostrarToast(datos.proximaFecha ? 'Resultado guardado y siguiente visita programada' : 'Resultado de la visita guardado');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Agenda</h2>
          <div className="subtitle">
            Semana {numeroSemana} de {anio} · {formatoFecha(lunes)} al {formatoFecha(domingo)}
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setVerFormulario(true)}>
          <Plus size={16} /> Nueva visita
        </button>
      </div>

      {/* ----- NAVEGACIÓN ENTRE SEMANAS ----- */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button type="button" className="btn btn-sm btn-outline" onClick={() => setLunes(sumarDias(lunes, -7))} aria-label="Semana anterior">
            <ChevronLeft size={15} /> Anterior
          </button>
          <button type="button" className="btn btn-sm btn-outline" onClick={() => setLunes(lunesDe(hoy))}>
            Esta semana
          </button>
          <button type="button" className="btn btn-sm btn-outline" onClick={() => setLunes(sumarDias(lunes, 7))} aria-label="Semana siguiente">
            Siguiente <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* ----- VISITAS DE LA SEMANA ----- */}
        <div className="card">
          <h3>Visitas de la semana <span className="pill pill-gris">{visitasSemana.length}</span></h3>
          <AgendaSemanal
            lunes={lunes}
            visitas={visitasSemana}
            nombreCliente={nombreCliente}
            onRegistrarResultado={setVisitaResultado}
          />
        </div>

        {/* ----- PRÓXIMAS ACTIVIDADES Y COMPROMISOS (SYS-FR-028) ----- */}
        <div>
          <div className="card">
            <h3>Próximas actividades</h3>
            {proximas.length === 0 && <p>No tienes visitas programadas.</p>}
            {proximas.map((v) => (
              <div className="visit-card" key={v.id}>
                <div className="vc-info">
                  <div className="vc-name">{nombreCliente(v.clienteId)}</div>
                  <div className="vc-meta">{v.objetivo} · {formatoFecha(v.fecha)} {v.hora}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>Compromisos pendientes</h3>
            {pendientes.length === 0 && <p>No hay compromisos pendientes.</p>}
            {pendientes.map((c) => (
              <div className="visit-card" key={c.id}>
                <div className="vc-info">
                  <div className="vc-name">{nombreCliente(c.clienteId)}</div>
                  <div className="vc-meta">{c.tipo} · para el {formatoFecha(c.fecha)}</div>
                </div>
                <span className="pill pill-amarillo">Pendiente</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----- VENTANA: NUEVA VISITA ----- */}
      {verFormulario && (
        <Modal titulo="Nueva visita" onCerrar={() => setVerFormulario(false)}>
          <FormularioVisita onGuardar={guardarVisita} onCancelar={() => setVerFormulario(false)} />
        </Modal>
      )}

      {/* ----- VENTANA: RESULTADO DE LA VISITA ----- */}
      {visitaResultado && (
        <Modal titulo="Resultado de la visita" onCerrar={() => setVisitaResultado(null)}>
          <FormularioResultadoVisita
            visita={visitaResultado}
            nombreCliente={nombreCliente(visitaResultado.clienteId)}
            onGuardar={guardarResultado}
            onCancelar={() => setVisitaResultado(null)}
          />
        </Modal>
      )}
    </>
  );
}