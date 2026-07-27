import { Pool } from 'pg';
import { Resend } from 'resend';
import { buildEmailHtml } from './emailTemplate';

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
    try {
      await sendBienvenidaEmail(result.rows[0].email, result.rows[0].nombre);
    } catch (mailErr) {
      console.error('Error enviando mail de bienvenida:', mailErr);
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
    const table = source === 'webinar' ? 'leads_webinar' : source === 'formacion' ? 'leads_formacion' : '"Leads"';
    const db = getPool();
    const result = await db.query(`SELECT * FROM ${table} ORDER BY fecha DESC`);
    return Response.json(result.rows);
  } catch (e) {
    console.error('DB error:', e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}
