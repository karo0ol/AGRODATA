// Mensaje: caja de aviso para errores, confirmaciones y advertencias.
//
// PROPS:
//   tipo:     'aviso' (por defecto, amarillo) | 'error' (rojo) | 'exito' (verde)
//   fondo:    'claro' (por defecto, pantallas internas) | 'oscuro' (pantallas de acceso: Login, Registro...)
//   children: el texto
//
// Los errores se anuncian de inmediato a los lectores de pantalla (role="alert");
// los demás avisos se leen sin interrumpir (role="status").
//
// Ejemplo:
//   {error && <Mensaje tipo="error">{error}</Mensaje>}
//   {ok && <Mensaje tipo="exito" fondo="oscuro">Correo verificado.</Mensaje>}

const BASE_CLARO = { padding: '12px 16px', borderRadius: 10, fontSize: 13.5, marginBottom: 16, lineHeight: 1.4 };

const ESTILOS_CLAROS = {
  error: { background: 'var(--rojo-bg)', border: '1px solid var(--rojo)', color: 'var(--rojo)' },
  exito: { background: 'var(--verde-bg)', border: '1px solid var(--verde-acento)', color: 'var(--verde-acento)' },
};

export default function Mensaje({ tipo = 'aviso', fondo = 'claro', children }) {
  const rol = tipo === 'error' ? 'alert' : 'status';

  // Sobre fondo oscuro se reutilizan las clases de extras.css
  if (fondo === 'oscuro') {
    const clase = tipo === 'error' ? 'form-error' : tipo === 'exito' ? 'form-ok' : 'banner-warn';
    return <div className={clase} role={rol}>{children}</div>;
  }

  // Sobre fondo claro: el aviso usa banner-warn y los demás un estilo propio
  if (tipo === 'aviso') {
    return <div className="banner-warn" role={rol}>{children}</div>;
  }
  return <div role={rol} style={{ ...BASE_CLARO, ...ESTILOS_CLAROS[tipo] }}>{children}</div>;
}