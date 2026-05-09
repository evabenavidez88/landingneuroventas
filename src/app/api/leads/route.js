import { Pool } from 'pg';

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
    const db = getPool();
    const result = await db.query('SELECT * FROM "Leads" ORDER BY fecha DESC');
    return Response.json(result.rows);
  } catch (e) {
    console.error('DB error:', e);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
