// CampoTexto: campo de texto con su etiqueta, para formularios dentro de modales y páginas
// (usa las clases "fld" del prototipo).
//
// PROPS:
//   id:         identificador (si no lo das, se genera uno)
//   etiqueta:   texto de la etiqueta
//   valor:      valor actual
//   onChange:   recibe el TEXTO nuevo, no el evento (igual que CampoClave): onChange={setNombre}
//   tipo:       'text' (por defecto), 'email', 'tel', 'number', 'date'...
//   requerido:  true marca el campo como obligatorio y agrega " *" a la etiqueta
//   multilinea: true dibuja un área de texto en vez de una línea
//   error:      mensaje de error en rojo (opcional)
//   ayuda:      texto de ayuda en gris (opcional)
//   Cualquier otra prop (placeholder, min, max, maxLength, disabled...) pasa al campo.
//
// Ejemplo:
//   <CampoTexto etiqueta="Teléfono" tipo="tel" valor={tel} onChange={setTel} requerido />

import { useId } from 'react';

export default function CampoTexto({
  id,
  etiqueta,
  valor,
  onChange,
  tipo = 'text',
  requerido = false,
  multilinea = false,
  error = '',
  ayuda = '',
  ...resto
}) {
  const idAuto = useId();
  const idCampo = id ?? idAuto;
  const idMensaje = `${idCampo}-mensaje`;

  const propsCampo = {
    id: idCampo,
    value: valor,
    onChange: (e) => onChange(e.target.value),
    required: requerido,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || ayuda ? idMensaje : undefined,
    ...resto,
  };

  return (
    <div className="fld">
      <label htmlFor={idCampo}>{etiqueta}{requerido ? ' *' : ''}</label>
      {multilinea ? <textarea {...propsCampo} /> : <input type={tipo} {...propsCampo} />}
      {(error || ayuda) && (
        <small
          id={idMensaje}
          role={error ? 'alert' : undefined}
          style={{ display: 'block', marginTop: 4, fontSize: 12, color: error ? 'var(--rojo)' : 'var(--gris-texto)' }}
        >
          {error || ayuda}
        </small>
      )}
    </div>
  );
}