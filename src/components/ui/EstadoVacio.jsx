// EstadoVacio: lo que se muestra cuando una lista no tiene nada que mostrar.
//
// PROPS:
//   icono:       componente de lucide-react (opcional)
//   titulo:      mensaje principal
//   descripcion: explicación corta (opcional)
//   children:    un botón de acción (opcional)
//
// Ejemplo:
//   <EstadoVacio icono={Users} titulo="Aún no tienes clientes" descripcion="Crea el primero o importa tu Excel.">
//     <Boton icono={Plus} onClick={abrir}>Nuevo cliente</Boton>
//   </EstadoVacio>

export default function EstadoVacio({ icono: Icono, titulo, descripcion, children }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      {Icono && (
        <div className="confirm-icon">
          <Icono aria-hidden="true" />
        </div>
      )}
      <h3 style={{ fontSize: 16, marginBottom: 6 }}>{titulo}</h3>
      {descripcion && <p className="vc-meta">{descripcion}</p>}
      {children && <div style={{ marginTop: 14 }}>{children}</div>}
    </div>
  );
}