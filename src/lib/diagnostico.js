import { Pool } from 'pg';
import contenido from './diagnostico-contenido.json';

let pool = null;
let tablaLista = false;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not configured');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('railway.internal') || process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function asegurarTabla(db) {
  if (tablaLista) return;
  await db.query(`CREATE TABLE IF NOT EXISTS leads_diagnostico (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    perfil TEXT NOT NULL,
    respuestas_a INT NOT NULL,
    respuestas_b INT NOT NULL,
    respuestas_c INT NOT NULL,
    orden_pct INT NOT NULL,
    foco_pct INT NOT NULL,
    seguimiento_pct INT NOT NULL,
    eje_prioritario TEXT NOT NULL,
    respuestas TEXT NOT NULL,
    origen TEXT
  )`);
  tablaLista = true;
}

export function calcularResultado(nombre, respuestas) {
  const R = contenido.reglas;
  const conteo = { A: 0, B: 0, C: 0 };
  respuestas.forEach((r) => conteo[r]++);

  const orden = Object.entries(conteo).sort((a, b) => b[1] - a[1]);
  const clave =
    orden[0][1] >= R.umbral_mayoria && orden[0][1] - orden[1][1] >= R.diferencia_minima
      ? orden[0][0]
      : 'MIXTO';

  const ejes = contenido.ejes.map((e) => {
    const n = e.preguntas.length;
    const suma = e.preguntas.reduce((acc, q) => acc + R.puntos[respuestas[q - 1]], 0);
    const porcentaje = Math.round(((suma - n) / (2 * n)) * 100);
    const nivel = porcentaje < R.corte_bajo ? 'bajo' : porcentaje < R.corte_alto ? 'medio' : 'alto';
    return {
      id: e.id,
      nombre: e.nombre,
      subtitulo: e.subtitulo,
      porcentaje,
      nivel,
      texto: e.niveles[nivel].texto,
      accion: e.niveles[nivel].accion,
    };
  });
  // Eje prioritario: el de menor porcentaje (en empate: Orden > Foco > Seguimiento).
  const prioritario = ejes.reduce((min, e) => (e.porcentaje < min.porcentaje ? e : min), ejes[0]);

  return { nombre, perfil: contenido.perfiles[clave], conteo, ejes, prioritario: prioritario.id };
}

