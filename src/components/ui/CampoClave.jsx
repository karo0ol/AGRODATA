// CampoClave: campo de contraseña con el "ojito" para mostrarla u ocultarla.
// Es para las pantallas de acceso (fondo verde oscuro), por eso usa las clases "field" del prototipo.
//
// PROPS (las mismas que usan Login, Registro y RecuperarContrasena):
//   id:           identificador del campo
//   etiqueta:     texto de la etiqueta
//   valor:        valor actual
//   onChange:     recibe el TEXTO nuevo, no el evento: onChange={setClave}
//   autoComplete: 'current-password' (login) o 'new-password' (registro)
//   minLength:    largo mínimo (opcional)
//   required:     obligatorio (true por defecto)
//   Cualquier otra prop pasa al <input>.

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function CampoClave({
  id,
  etiqueta,
  valor,
  onChange,
  autoComplete,
  minLength,
  required = true,
  ...resto
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="input-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required={required}
          style={{ paddingRight: 44 }}   // deja espacio para el ojito
          {...resto}
        />
        <button
          type="button"
          className="toggle-pass"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}