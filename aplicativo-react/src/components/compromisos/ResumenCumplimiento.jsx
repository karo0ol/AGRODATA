// ResumenCumplimiento: porcentaje de cumplimiento de los compromisos (SYS-FR-041).
//   cumplimiento = cumplidos ÷ pactados × 100
//   (los incumplidos cuentan como pactados y se conservan en el historial, SYS-FR-042)
//
// PROPS:
//   compromisos: [{ estado: 'Pendiente' | 'Cumplido' | 'Incumplido', ... }]

import { useMemo } from 'react';
import { resumirCompromisos } from '../../utils/calculos.js';

export default function ResumenCumplimiento({ compromisos = [] }) {
  const resumen = useMemo(() => resumirCompromisos(compromisos), [compromisos]);

  return (
    <section className="card" aria-label="Cumplimiento de compromisos" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h3>Cumplimiento de compromisos</h3>
        <strong style={{ fontSize: 24, color: 'var(--verde-oscuro)' }}>{resumen.porcentaje}%</strong>
      </div>

      <div
        className="progress-bar-lg"
        role="progressbar"
        aria-valuenow={resumen.porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Porcentaje de compromisos cumplidos"
      >
        <div className="fill" style={{ width: `${resumen.porcentaje}%` }} />
      </div>

      <div className="stat-grid" style={{ marginBottom: 0 }}>
        <div className="stat-card"><div className="st-label">Pactados</div><div className="st-val">{resumen.total}</div></div>
        <div className="stat-card"><div className="st-label">Cumplidos</div><div className="st-val">{resumen.cumplidos}</div></div>
        <div className="stat-card"><div className="st-label">Pendientes</div><div className="st-val">{resumen.pendientes}</div></div>
        <div className="stat-card"><div className="st-label">Incumplidos</div><div className="st-val">{resumen.incumplidos}</div></div>
      </div>
    </section>
  );
}
