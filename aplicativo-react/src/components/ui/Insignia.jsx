// Insignia: etiqueta redonda de color para estados (la clase "pill" del prototipo).
//
// PROPS:
//   color:    'verde' | 'amarillo' | 'rojo' | 'gris' (por defecto) | 'morado'
//   icono:    componente de lucide-react (opcional)
//   children: el texto
//
// Ejemplo:
//   <Insignia color="verde">Cumplido</Insignia>
//   <Insignia color="rojo" icono={TimerOff}>Fecha vencida</Insignia>

const COLORES = {
  verde: 'pill-verde',
  amarillo: 'pill-amarillo',
  rojo: 'pill-rojo',
  gris: 'pill-gris',
  morado: 'pill-morado',
};

export default function Insignia({ color = 'gris', icono: Icono, children }) {
  return (
    <span className={`pill ${COLORES[color] ?? COLORES.gris}`}>
      {Icono && <Icono size={12} aria-hidden="true" />}
      {children}
    </span>
  );
}