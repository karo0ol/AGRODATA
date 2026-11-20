// HistorialCliente: historial de visitas de un cliente, de la más reciente a la más antigua
// (M3 · SYS-FR-031). Se usa en la pestaña "Visitas" de la ficha.
//
// PROPS:
//   visitas: [{ id, objetivo, fecha: 'AAAA-MM-DD', hora?, estado: 'Programada' | 'Realizada',
//               resultado?, notas? }]
//            (ya filtradas por cliente; ClienteDetalle se las entrega así)

import { CalendarDays } from 'lucide-react';
import Insignia from '../ui/Insignia.jsx';
import EstadoVacio from '../ui/EstadoVacio.jsx';

const COLOR_ESTADO = { Programada: 'amarillo', Realizada: 'verde' };

// '2026-11-16' → '16 nov 2026'
const fechaLarga = (texto) =>
  new Date(texto + 'T00:00:00')
    .toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    .replace('.', '');

export default function HistorialCliente({ visitas }) {
  if (visitas.length === 0) {
    return (
      <EstadoVacio
        icono={CalendarDays}
        titulo="Sin visitas registradas"
        descripcion="Cuando programes o registres una visita a este cliente, aparecerá aquí."
      />
    );
  }

  // Más reciente primero (por fecha y, si hay empate, por hora)
  const ordenadas = [...visitas].sort((a, b) =>
    `${b.fecha} ${b.hora ?? ''}`.localeCompare(`${a.fecha} ${a.hora ?? ''}`),
  );

  return (
    <div>
      {ordenadas.map((v) => (
        <div className="timeline-item" key={v.id}>
          {/* Punto verde = realizada; gris = todavía programada */}
          <div
            className="ti-dot"
            style={v.estado === 'Programada' ? { background: 'var(--gris-texto)' } : undefined}
          />
          <div style={{ flex: 1 }}>
            <div className="ti-title" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {v.objetivo}
              <Insignia color={COLOR_ESTADO[v.estado] ?? 'gris'}>{v.estado}</Insignia>
            </div>
            <div className="ti-date">
              {fechaLarga(v.fecha)}{v.hora ? ` · ${v.hora}` : ''}
            </div>
            {v.resultado && <div className="vc-meta"><strong>Resultado:</strong> {v.resultado}</div>}
            {v.notas && <div className="vc-meta"><strong>Notas:</strong> {v.notas}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}