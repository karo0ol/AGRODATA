// AgendaSemanal: las visitas de una semana, día por día de lunes a domingo (SYS-FR-027).
//
// PROPS:
//   lunes:                fecha del lunes de la semana ('AAAA-MM-DD')
//   visitas:              visitas de esa semana: { id, clienteId, objetivo, fecha, hora, estado, resultado? }
//   nombreCliente:        función (clienteId) => nombre del cliente
//   onRegistrarResultado: función que recibe la visita a la que se le va a registrar el resultado
//                         (solo se ofrece en visitas que siguen "Programada")

import { sumarDias, formatoFecha } from '../../utils/fechas.js';
import Boton from '../ui/Boton.jsx';
import Insignia from '../ui/Insignia.jsx';

const DIAS_DE_LA_SEMANA = [0, 1, 2, 3, 4, 5, 6];

// '2026-11-16' → 'lunes'
const nombreDia = (fecha) =>
  new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'long' });

export default function AgendaSemanal({ lunes, visitas, nombreCliente, onRegistrarResultado }) {
  const hoy = new Date().toLocaleDateString('en-CA');

  return (
    <div>
      {DIAS_DE_LA_SEMANA.map((i) => {
        const fecha = sumarDias(lunes, i);
        const delDia = visitas
          .filter((v) => v.fecha === fecha)
          .sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? ''));

        return (
          <section key={fecha} aria-label={`${nombreDia(fecha)} ${formatoFecha(fecha)}`}>
            <div
              className="section-label"
              style={{ marginTop: i === 0 ? 0 : 18, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {nombreDia(fecha)} · {formatoFecha(fecha)}
              {fecha === hoy && <Insignia color="verde">Hoy</Insignia>}
            </div>

            {delDia.length === 0 && <p className="vc-meta">Sin visitas.</p>}

            {delDia.map((v) => {
              const programada = v.estado === 'Programada';
              const sinResultado = programada && v.fecha < hoy;   // ya pasó y nadie registró cómo le fue

              return (
                <div className="visit-card" key={v.id}>
                  <div className="vc-info">
                    <div className="vc-name">{v.hora} · {nombreCliente(v.clienteId)}</div>
                    <div className="vc-meta">{v.objetivo}</div>
                    {v.resultado && (
                      <div className="vc-meta"><strong>Resultado:</strong> {v.resultado}</div>
                    )}
                  </div>

                  <div className="vc-actions">
                    {sinResultado && <Insignia color="rojo">Sin resultado</Insignia>}
                    <Insignia color={programada ? 'amarillo' : 'verde'}>{v.estado}</Insignia>
                    {programada && (
                      <Boton tamano="sm" onClick={() => onRegistrarResultado(v)}>
                        Registrar resultado
                      </Boton>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}