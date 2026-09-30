import { getPool, asegurarTabla, calcularResultado } from '../../../lib/diagnostico';

// Diagnóstico Neuroventa Digital: recibe datos + respuestas, calcula el
// resultado en el servidor y guarda el diagnóstico en leads_diagnostico.
// Si la base falla, igual devuelve el resultado (no se frena la experiencia).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Límite simple por IP (en memoria): 20 envíos por hora.
const envios = new Map();
function superaLimite(ip) {
  const ahora = Date.now();
  const lista = (envios.get(ip) || []).filter((t) => t > ahora - 3600_000);
  lista.push(ahora);
  envios.set(ip, lista);
  return lista.length > 20;
}

function error(status, mensaje) {
  return Response.json({ ok: false, error: mensaje }, { status });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return error(400, 'No pudimos leer tus respuestas. Probá de nuevo.');
  }
  if (body?.sitio_web) return error(200, 'No pudimos procesar el envío.');

  const nombre = String(body?.nombre ?? '').replace(/\s+/g, ' ').trim();
  const email = String(body?.email ?? '').trim().toLowerCase();
  const respuestas = Array.isArray(body?.respuestas) ? body.respuestas : null;

  if (!nombre || nombre.length > 80) return error(422, 'Escribí tu nombre.');
  if (!EMAIL_RE.test(email) || email.length > 120) return error(422, 'Revisá tu email.');
  if (body?.acepta !== true) return error(422, 'Necesitamos tu consentimiento para enviarte el resultado.');
  if (!respuestas || respuestas.length !== 15) return error(422, 'Faltan respuestas. Completá las 15 preguntas.');
  if (!respuestas.every((r) => r === 'A' || r === 'B' || r === 'C')) {
    return error(422, 'Hay una respuesta inválida. Probá de nuevo.');
  }

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'desconocida';
  if (superaLimite(ip)) return error(429, 'Recibimos muchos envíos desde tu conexión. Probá en un rato.');

  const resultado = calcularResultado(nombre, respuestas);

  try {
    const db = getPool();
    await asegurarTabla(db);
    const eje = (id) => resultado.ejes.find((e) => e.id === id).porcentaje;
    await db.query(
      `INSERT INTO leads_diagnostico
        (nombre, email, perfil, respuestas_a, respuestas_b, respuestas_c,
         orden_pct, foco_pct, seguimiento_pct, eje_prioritario, respuestas, origen, total_pct)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        nombre,
        email,
        resultado.perfil.nombre,
        resultado.conteo.A,
        resultado.conteo.B,
        resultado.conteo.C,
        eje('orden'),
        eje('foco'),
        eje('seguimiento'),
        resultado.ejes.find((e) => e.id === resultado.prioritario).nombre,
        respuestas.join(''),
        body?.origen === 'landing' ? 'landing' : 'directo',
        resultado.total,
      ]
    );
  } catch (e) {
    console.error('diagnostico: no se pudo guardar el lead', e.message);
  }

  return Response.json({ ok: true, resultado });
}
