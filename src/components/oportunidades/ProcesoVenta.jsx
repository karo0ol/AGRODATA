// ProcesoVenta: muestra de un vistazo CÓMO AVANZA UNA VENTA y cuántas oportunidades hay en cada paso.
//
//   Nueva → En contacto → En negociación → Venta cerrada
//
// Las tres primeras etapas son oportunidades (proyecciones). La última ocurre cuando el RTC
// pulsa "Cerrar venta": ahí se registra la venta real y la oportunidad pasa a "Convertida".
//
// PROPS:
//   conteos:   { 'Nueva': n, 'En contacto': n, 'En negociación': n }  (oportunidades abiertas por etapa)
//   cerradas:  número de oportunidades ya convertidas en venta

import { CheckCircle2 } from 'lucide-react';

const ETAPAS = [
  { nombre: 'Nueva', detalle: 'Registraste el interés del cliente' },
  { nombre: 'En contacto', detalle: 'Ya hablaste con el cliente' },
  { nombre: 'En negociación', detalle: 'Se conversa precio y condiciones' },
];

export default function ProcesoVenta({ conteos, cerradas }) {
  return (
    <ol className="proceso-venta" aria-label="Etapas de una venta">
      {ETAPAS.map((etapa, i) => (
        <li className="proceso-paso" key={etapa.nombre}>
          <span className="proceso-num" aria-hidden="true">{i + 1}</span>
          <div>
            <strong>{etapa.nombre}</strong>
            <small>{etapa.detalle}</small>
            <span className="proceso-cuenta">{conteos[etapa.nombre] ?? 0} oportunidad(es)</span>
          </div>
        </li>
      ))}

      <li className="proceso-paso proceso-final">
        <span className="proceso-num" aria-hidden="true"><CheckCircle2 size={16} /></span>
        <div>
          <strong>Venta cerrada</strong>
          <small>Con «Cerrar venta» se registra en Ventas</small>
          <span className="proceso-cuenta">{cerradas} convertida(s)</span>
        </div>
      </li>
    </ol>
  );
}
