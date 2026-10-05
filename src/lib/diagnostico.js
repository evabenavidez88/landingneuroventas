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
  await db.query('ALTER TABLE leads_diagnostico ADD COLUMN IF NOT EXISTS total_pct INT');
  tablaLista = true;
}

export function calcularResultado(nombre, respuestas) {
  const R = contenido.reglas;
  const conteo = { A: 0, B: 0, C: 0 };
  respuestas.forEach((r) => conteo[r]++);

  const ejes = contenido.ejes.map((e) => {
    const puntos = e.preguntas.reduce((acc, q) => acc + R.puntos[respuestas[q - 1]], 0);
    const maximo = e.preguntas.length * R.puntos.C;
    const porcentaje = Math.round((puntos / maximo) * 100);
    const nivel = porcentaje < R.corte_bajo ? 'bajo' : porcentaje < R.corte_alto ? 'medio' : 'alto';
    return {
      id: e.id, nombre: e.nombre, subtitulo: e.subtitulo, puntos, maximo, porcentaje, nivel,
      texto: e.niveles[nivel].texto, accion: e.niveles[nivel].accion,
    };
  });

  const puntosTotal = ejes.reduce((a, e) => a + e.puntos, 0);
  const maximoTotal = ejes.reduce((a, e) => a + e.maximo, 0);
  const total = Math.round((puntosTotal / maximoTotal) * 100);

  // Reparto: qué parte del puntaje total aporta cada eje (suma exactamente 100%).
  if (puntosTotal > 0) {
    const crudos = ejes.map((e) => (e.puntos / puntosTotal) * 100);
    const base = crudos.map(Math.floor);
    let resto = 100 - base.reduce((a, b) => a + b, 0);
    crudos.map((v, i) => [v - base[i], i]).sort((x, y) => y[0] - x[0]).forEach(([, i]) => { if (resto > 0) { base[i]++; resto--; } });
    ejes.forEach((e, i) => { e.reparto = base[i]; });
  } else {
    ejes.forEach((e) => { e.reparto = 0; });
  }

  // Perfil: alto rendimiento desde el 95% del total; bajo si el total no llega al mínimo;
  // avanzado si TODOS los ejes superan el corte; si no, medio.
  const clave = total >= R.perfil_alto_rendimiento ? 'D'
    : total < R.perfil_bajo ? 'A'
    : ejes.every((e) => e.porcentaje >= R.perfil_avanzado) ? 'C' : 'B';

  // Eje prioritario: el de menor porcentaje (en empate: Orden > Foco > Seguimiento).
  const prioritario = ejes.reduce((min, e) => (e.porcentaje < min.porcentaje ? e : min), ejes[0]);

  // Próximo paso: según el eje prioritario; suma la fortaleza si el eje más fuerte lo es y es otro.
  const pp = contenido.proximo_paso;
  const fuerte = ejes.reduce((max, e) => (e.porcentaje > max.porcentaje ? e : max), ejes[0]);
  let proximo_paso = clave === 'D' ? pp.alto_rendimiento : pp[prioritario.id][clave === 'C' ? 'avanzado' : 'base'];
  if (clave !== 'C' && clave !== 'D' && fuerte.id !== prioritario.id && fuerte.porcentaje >= R.corte_alto) {
    proximo_paso += ` Apoyate en tu fortaleza en ${fuerte.nombre}: ${pp[fuerte.id].fortaleza}`;
  }

  return { nombre, perfil: contenido.perfiles[clave], conteo, total, puntos_total: puntosTotal, maximo_total: maximoTotal, ejes, prioritario: prioritario.id, proximo_paso };
}
