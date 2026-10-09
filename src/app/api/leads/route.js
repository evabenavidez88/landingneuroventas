import { Pool } from 'pg';
import { Resend } from 'resend';
import { buildEmailHtml } from './emailTemplate';
import { asegurarTabla } from '../../../lib/diagnostico';
import { asegurarTablas, leerConfig, guardarConfig, normalizar } from '../../../lib/mails/motor';

let pool = null;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not configured');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('railway.internal')
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

function checkAuth(request) {
  const key = request.headers.get('x-admin-key');
  return key && key === process.env.ADMIN_KEY;
}

let resend = null;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

async function sendBienvenidaEmail(to, nombre) {
  return getResend().emails.send({
    from: 'Eva Benavidez <info@evabenavidez.com>',
    to,
    subject: 'Tu diagnóstico ya está listo — y esto recién empieza ✍️',
    html: buildEmailHtml(nombre),
  });
}

export async function POST(request) {
  try {
    const { nombre, email } = await request.json();
    if (!nombre?.trim() || !email?.trim()) {
      return Response.json({ error: 'Datos incompletos' }, { status: 400 });
    }
    const db = getPool();
    const result = await db.query(
      'INSERT INTO "Leads" (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre.trim(), email.trim().toLowerCase()]
    );
    // Envío del email con el checklist pausado: después del formulario la persona hace el diagnóstico online.
    // Para reactivarlo, poner ENVIAR_EMAIL_CHECKLIST=true en las variables de Railway.
    if (process.env.ENVIAR_EMAIL_CHECKLIST === 'true') {
      try {
        await sendBienvenidaEmail(result.rows[0].email, result.rows[0].nombre);
      } catch (mailErr) {
        console.error('Error enviando mail de bienvenida:', mailErr);
      }
    }
    return Response.json(result.rows[0], { status: 201 });
  } catch (e) {
    if (e.code === '23505') {
      return Response.json({ error: 'Email ya registrado' }, { status: 409 });
    }
    console.error('DB error:', e);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const table = source === 'webinar' ? 'leads_webinar' : source === 'formacion' ? 'leads_formacion' : source === 'diagnostico' ? 'leads_diagnostico' : '"Leads"';
    const db = getPool();
    if (source === 'diagnostico') await asegurarTabla(db);
    const result = await db.query(`SELECT * FROM ${table} ORDER BY fecha DESC`);
    return Response.json(result.rows);
  } catch (e) {
    console.error('DB error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// Borra filas de prueba de cualquier solapa del panel (solo con clave de admin).
// Los emails borrados se suman a "Emails excluidos" de los mails automáticos,
// así nadie de prueba recibe recordatorios al desaparecer de una base.
const TABLAS = { checklist: '"Leads"', webinar: 'leads_webinar', formacion: 'leads_formacion', diagnostico: 'leads_diagnostico' };

export async function DELETE(request) {
  if (!checkAuth(request)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const tabla = TABLAS[searchParams.get('source') || 'checklist'];
    if (!tabla) return Response.json({ error: 'Solapa desconocida' }, { status: 400 });
    const { ids } = await request.json();
    const lista = (Array.isArray(ids) ? ids : []).map((x) => String(x)).filter((x) => /^\d+$/.test(x));
    if (lista.length === 0) return Response.json({ error: 'No hay filas seleccionadas' }, { status: 400 });
    const db = getPool();
    const borradas = (await db.query(`DELETE FROM ${tabla} WHERE id::text = ANY($1::text[]) RETURNING email`, [lista])).rows;
    const emails = [...new Set(borradas.map((r) => normalizar(r.email)).filter(Boolean))];
    if (emails.length) {
      await asegurarTablas(db);
      const { excluidos } = await leerConfig(db);
      await guardarConfig(db, 'excluidos', [...new Set([...excluidos, ...emails])].join(','));
    }
    return Response.json({ ok: true, borradas: borradas.length, excluidos: emails });
  } catch (e) {
    console.error('DB error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
