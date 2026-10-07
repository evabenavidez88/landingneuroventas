import { getPool } from '../../../lib/diagnostico';
import { asegurarTablas, leerConfig, guardarConfig, pendientes, enviarPrueba, correr, normalizar, CALENDARIO } from '../../../lib/mails/motor';

// Panel de los mails automáticos (solo con la clave del panel).
export const dynamic = 'force-dynamic';
const autorizado = (req) => { const k = req.headers.get('x-admin-key'); return k && k === process.env.ADMIN_KEY; };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function estado(db) {
  const config = await leerConfig(db);
  const env = (await db.query('SELECT mail, COUNT(*)::int AS n FROM mail_envios GROUP BY mail')).rows;
  const bajas = (await db.query('SELECT COUNT(*)::int AS n FROM mail_bajas')).rows[0].n;
  const pend = await pendientes(db);
  const porMail = (filas) => Object.fromEntries(['1A', '1B', '2', '3A', '3B'].map((m) => [m, 0]).concat(filas));
  return {
    activo: config.activo,
    excluidos: config.excluidos,
    enviados: porMail(env.map((r) => [r.mail, r.n])),
    pendientes: porMail(Object.entries(pend.reduce((a, x) => ((a[x.mail] = (a[x.mail] || 0) + 1), a), {}))),
    bajas,
    calendario: Object.fromEntries(Object.entries(CALENDARIO).map(([k, v]) => [k, new Date(v).toISOString()])),
  };
}

export async function GET(request) {
  if (!autorizado(request)) return Response.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const db = getPool();
    await asegurarTablas(db);
    return Response.json(await estado(db));
  } catch (e) {
    console.error('mails GET', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!autorizado(request)) return Response.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const body = await request.json();
    const db = getPool();
    await asegurarTablas(db);
    if (body.accion === 'activar' || body.accion === 'pausar') {
      await guardarConfig(db, 'activo', body.accion === 'activar' ? 'true' : 'false');
      if (body.accion === 'activar') correr(); // primera revisión en el momento
    } else if (body.accion === 'excluidos') {
      const lista = String(body.excluidos || '').split(/[\s,;]+/).map(normalizar).filter(Boolean);
      await guardarConfig(db, 'excluidos', lista.join(','));
    } else if (body.accion === 'prueba') {
      const email = normalizar(body.email);
      if (!EMAIL_RE.test(email)) return Response.json({ error: 'Revisá el email' }, { status: 422 });
      const enviados = await enviarPrueba(email);
      return Response.json({ ...(await estado(db)), ok: true, prueba: enviados, email });
    } else {
      return Response.json({ error: 'Acción desconocida' }, { status: 400 });
    }
    return Response.json({ ok: true, ...(await estado(db)) });
  } catch (e) {
    console.error('mails POST', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
