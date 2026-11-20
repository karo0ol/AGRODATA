// documentoEjemplo: genera un PDF sencillo de EJEMPLO para poder probar los botones
// «Ver» y «Descargar» de los documentos del cliente mientras no hay servidor.
// En el sistema real, el documento vendría del almacenamiento privado (SYS-SEC-012).

// Los PDF básicos usan una sola codificación (WinAnsi ≈ Latin-1): tildes y ñ funcionan,
// cualquier otro símbolo raro se cambia por «?».
const limpiar = (texto) =>
  [...String(texto)]
    .map((c) => (c.charCodeAt(0) < 256 ? c : '?'))
    .join('')
    .replace(/[\\()]/g, '\\$&');

export function crearPdfEjemplo(titulo, lineas = []) {
  const contenido = [
    'BT',
    '/F1 20 Tf 72 740 Td 24 TL',
    `(${limpiar(titulo)}) Tj`,
    '/F1 12 Tf 18 TL',
    'T*',
    ...lineas.flatMap((l) => [`(${limpiar(l)}) Tj`, 'T*']),
    'ET',
  ].join('\n');

  const objetos = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${contenido.length} >>\nstream\n${contenido}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  ];

  let pdf = '%PDF-1.4\n';
  const posiciones = [];
  objetos.forEach((obj, i) => {
    posiciones.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const inicioXref = pdf.length;
  pdf += `xref\n0 ${objetos.length + 1}\n0000000000 65535 f \n`;
  posiciones.forEach((p) => { pdf += `${String(p).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objetos.length + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF`;

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 255;
  return new Blob([bytes], { type: 'application/pdf' });
}
