// Boton: botón con las variantes de color del prototipo.
//
// PROPS:
//   variante: 'primario' (por defecto) | 'contorno' | 'oscuro' | 'peligro' | 'peligroSolido'
//   tamano:   'sm' para el botón pequeño (opcional)
//   icono:    componente de lucide-react (opcional), por ejemplo icono={Plus}
//   cargando: true deshabilita el botón y muestra "Procesando…"
//   type:     'button' por defecto (así no envía un formulario sin querer); usa type="submit" para enviar
//   Cualquier otra prop (onClick, disabled, aria-label...) pasa directo al <button>.
//
// Ejemplo:
//   <Boton icono={Plus} onClick={abrir}>Nueva venta</Boton>
//   <Boton type="submit" cargando={guardando}>Guardar</Boton>

const VARIANTES = {
  primario: 'btn-primary',
  contorno: 'btn-outline',
  oscuro: 'btn-dark',
  peligro: 'btn-danger',
  peligroSolido: 'btn-danger-solid',
};

export default function Boton({
  variante = 'primario',
  tamano,
  icono: Icono,
  cargando = false,
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...resto
}) {
  const clases = ['btn', VARIANTES[variante] ?? VARIANTES.primario, tamano === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={clases}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...resto}
    >
      {Icono && !cargando && <Icono size={tamano === 'sm' ? 14 : 16} aria-hidden="true" />}
      {cargando ? 'Procesando…' : children}
    </button>
  );
}