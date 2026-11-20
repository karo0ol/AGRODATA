// DetalleDia: las actividades del día elegido en el calendario mensual (SYS-FR-083).
//
// PROPS:
//   fecha:   'AAAA-MM-DD'
//   eventos: [{ tipo: 'visita' | 'compromiso' | 'seguimiento', titulo, detalle, hora? }]
//
// Alertas lo dibuja dentro de una <div className="card">.

import Insignia from '../ui/Insignia.jsx';

const TIPOS = {
  visita: { texto: 'Visita', color: 'verde' },
  compromiso: { texto: 'Compromiso', color: 'amarillo' },
  seguimiento: { texto: 'Seguimiento', color: 'morado' },
};

// '2026-11-16' → 'lunes, 16 de noviembre de 2026'
const fechaCompleta = (texto) =>
  new Date(texto + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

export default function DetalleDia({ fecha, eventos }) {
  // Primero las que tienen hora (de la más temprana a la más tarde); las demás al final
  const ordenados = [...eventos].sort((a, b) => (a.hora ?? '99:99').localeCompare(b.hora ?? '99:99'));

  return (
    // aria-live avisa a los lectores de pantalla cuando cambia el día elegido
    <div aria-live="polite">
      <div className="dp-head">
        <h3 style={{ margin: 0, textTransform: 'capitalize' }}>{fechaCompleta(fecha)}</h3>
        <Insignia color="gris">
          {ordenados.length} {ordenados.length === 1 ? 'actividad' : 'actividades'}
        </Insignia>
      </div>

      {ordenados.length === 0 && <p>No hay actividades este día.</p>}

      {ordenados.map((e, i) => {
        const tipo = TIPOS[e.tipo] ?? { texto: e.tipo, color: 'gris' };
        return (
          <div className="visit-card" key={i}>
            <div className="vc-info">
              <div className="vc-name">{e.titulo}</div>
              <div className="vc-meta">{e.detalle}{e.hora ? ` · ${e.hora}` : ''}</div>
            </div>
            <Insignia color={tipo.color}>{tipo.texto}</Insignia>
          </div>
        );
      })}
    </div>
  );
}