// CalendarioMensual: cuadrícula de un mes con las actividades de cada día (M3 · SYS-FR-081 a 085).
//   - Cada tipo de actividad se ve diferente: visita (verde), compromiso (amarillo)
//     y seguimiento (morado).                                                    (SYS-FR-084)
//   - Además del color, cada día tiene una descripción en texto para lectores de pantalla.
//   - Sin conexión, los meses no descargados se ven apagados y no se pueden abrir. (SYS-FR-085)
//
// PROPS:
//   anio, mes:        mes a dibujar (mes de 0 a 11, como en JavaScript)
//   hoy:              'AAAA-MM-DD' de hoy, para resaltarlo
//   eventosPorDia:    { 'AAAA-MM-DD': [{ tipo: 'visita' | 'compromiso' | 'seguimiento', ... }] }
//   diaSeleccionado:  'AAAA-MM-DD' del día elegido, o null
//   disponible:       false si el mes no está descargado y no hay conexión
//   onSeleccionar:    recibe la fecha del día al que se le hace clic
//
// Los estilos (.cal-*) están en extras.css.

const NOMBRES_DIA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const TIPOS = {
  visita: { singular: 'visita', plural: 'visitas' },
  compromiso: { singular: 'compromiso', plural: 'compromisos' },
  seguimiento: { singular: 'seguimiento', plural: 'seguimientos' },
};

export default function CalendarioMensual({
  anio,
  mes,
  hoy,
  eventosPorDia,
  diaSeleccionado,
  disponible,
  onSeleccionar,
}) {
  // Casillas vacías antes del día 1, para que caiga en su día de la semana (lunes = primera columna)
  const huecos = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const nombreMes = new Date(anio, mes, 1).toLocaleDateString('es-CO', { month: 'long' });

  const celdas = [
    ...Array(huecos).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  return (
    <div className="cal-grid">
      {NOMBRES_DIA.map((d) => (
        <div className="cal-head" key={d} aria-hidden="true">{d}</div>
      ))}

      {celdas.map((dia, i) => {
        if (dia === null) return <div key={`hueco-${i}`} />;

        const fecha = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const eventos = disponible ? (eventosPorDia[fecha] ?? []) : [];

        // Cuántas actividades hay de cada tipo en este día
        const porTipo = Object.keys(TIPOS)
          .map((tipo) => ({ tipo, n: eventos.filter((e) => e.tipo === tipo).length }))
          .filter((x) => x.n > 0);

        const resumen = porTipo.length === 0
          ? 'sin actividades'
          : porTipo.map(({ tipo, n }) => `${n} ${n === 1 ? TIPOS[tipo].singular : TIPOS[tipo].plural}`).join(', ');

        return (
          <button
            key={fecha}
            type="button"
            className={`cal-dia ${fecha === hoy ? 'hoy' : ''}`}
            disabled={!disponible}
            aria-pressed={fecha === diaSeleccionado}
            aria-label={`${dia} de ${nombreMes}: ${resumen}${fecha === hoy ? ' (hoy)' : ''}`}
            onClick={() => onSeleccionar(fecha)}
          >
            <span className="cal-num">{dia}</span>
            <span className="cal-dots">
              {porTipo.map(({ tipo, n }) => (
                <span key={tipo} className={`cal-dot cal-${tipo}`} aria-hidden="true">
                  {n > 1 ? n : ''}
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}