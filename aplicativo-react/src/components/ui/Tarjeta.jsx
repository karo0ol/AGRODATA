// Tarjeta: caja blanca con sombra (la clase "card" del prototipo).
//
// PROPS:
//   titulo:    texto del encabezado (opcional)
//   acciones:  algo que va a la derecha del título, como un botón o una insignia (opcional)
//   className: clases extra (opcional)
//   children:  el contenido
//
// Ejemplo:
//   <Tarjeta titulo="Historial de compras" acciones={<Insignia color="verde">Activo</Insignia>}>
//     ...
//   </Tarjeta>

export default function Tarjeta({ titulo, acciones, className = '', children, ...resto }) {
  return (
    <div className={`card ${className}`.trim()} {...resto}>
      {titulo && (
        <h3>
          <span>{titulo}</span>
          {acciones}
        </h3>
      )}
      {children}
    </div>
  );
}