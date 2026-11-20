// CampoSelect: lista desplegable con su etiqueta (clases "fld" del prototipo).
//
// PROPS:
//   id, etiqueta, valor, requerido, error, ayuda: igual que CampoTexto
//   onChange:    recibe el valor elegido (texto), no el evento
//   opciones:    arreglo de textos ['B2B', 'B2C'] o de objetos [{ valor: 'C1', texto: 'Finca La Esperanza' }]
//   placeholder: primera opción vacía ('Selecciona…' por defecto). Usa null para no mostrarla.
//   Cualquier otra prop (disabled...) pasa al <select>.
//
// Ejemplo:
//   <CampoSelect etiqueta="Departamento" valor={depto} onChange={setDepto}
//                opciones={departamentos} requerido />

import { useId } from 'react';

export default function CampoSelect({
  id,
  etiqueta,
  valor,
  onChange,
  opciones,
  placeholder = 'Selecciona…',
  requerido = false,
  error = '',
  ayuda = '',
  ...resto
}) {
  const idAuto = useId();
  const idCampo = id ?? idAuto;
  const idMensaje = `${idCampo}-mensaje`;

  // Acepta textos sueltos o objetos { valor, texto }
  const lista = opciones.map((o) => (typeof o === 'string' ? { valor: o, texto: o } : o));

  return (
    <div className="fld">
      <label htmlFor={idCampo}>{etiqueta}{requerido ? ' *' : ''}</label>
      <select
        id={idCampo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || ayuda ? idMensaje : undefined}
        {...resto}
      >
        {placeholder !== null && <option value="">{placeholder}</option>}
        {lista.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
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