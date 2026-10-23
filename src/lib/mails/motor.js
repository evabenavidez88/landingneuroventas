import { createHmac } from 'crypto';
import { Resend } from 'resend';
import { getPool, asegurarTabla, calcularResultado } from '../diagnostico';
import { SITIO, mail1A, mail1B, mail2, mail3A, mail3B, mailI1, mailI2, mailI3, mailI4, mailR,
  mailA1, mailA2, mailA3, mailB1, mailB2, mailB3, mailC1, mailC2, mailC3 } from './plantillas';

// Motor de los mails automáticos. Corre cada 10 minutos (ver src/instrumentation.js)
// y solo envía si el flujo está activado desde el panel.

const REMITENTE = 'Eva Benavidez <info@evabenavidez.com>';
const T = (iso) => new Date(iso).getTime();

// Fechas en UTC (ARG = UTC-3).
export const CALENDARIO = {
  inicioAutodiagnostico: T('2026-10-08T03:00:00Z'), // 8/10 00:00 ARG
  finAutodiagnostico: T('2026-11-03T03:00:00Z'),    // hasta 2/11 23:59 ARG
  finDosFechas: T('2026-10-22T22:00:00Z'),          // 22/10 19:00 ARG
  finMasterclass: T('2026-10-27T22:00:00Z'),        // 27/10 19:00 ARG
  envio3A: T('2026-10-20T22:00:00Z'),               // 20/10 19:00 ARG (corre hasta que arranca I1)
  envio3B: T('2026-10-25T22:00:00Z'),               // reemplazado por I3 (lunes 26/10): ya no se envía
  // Llamados a la acción a la base del autodiagnóstico que no se anotó, a las 10:00 ARG.
  envioI1: T('2026-10-21T13:00:00Z'),               // mié 21/10
  envioI2: T('2026-10-22T13:00:00Z'),               // jue 22/10 (hasta las 19 h)
  envioI3: T('2026-10-26T13:00:00Z'),               // lun 26/10
  envioI4: T('2026-10-27T13:00:00Z'),               // mar 27/10 (hasta las 19 h)
  // Inscripciones de la masterclass actual (para no escribirle a anotados de ediciones anteriores).
  inicioMasterclass: T('2026-10-01T03:00:00Z'),
};
// Ventanas de envío: [desde, hasta). Fuera de la ventana, ese mail ya no sale.
const VENTANAS = {
  '3A': [CALENDARIO.envio3A, CALENDARIO.envioI1],
  I1: [CALENDARIO.envioI1, CALENDARIO.envioI2],
  I2: [CALENDARIO.envioI2, CALENDARIO.finDosFechas],
  I3: [CALENDARIO.envioI3, CALENDARIO.envioI4],
  I4: [CALENDARIO.envioI4, CALENDARIO.finMasterclass],
  R22: [CALENDARIO.envioI2, CALENDARIO.finDosFechas],
  R27: [CALENDARIO.envioI4, CALENDARIO.finMasterclass],
};
// Nutrición para el Entrenamiento: cada pieza sale el día indicado, de 10 a 20 h (ARG).
const dia = (iso) => [T(`${iso}T13:00:00Z`), T(`${iso}T23:00:00Z`)];
Object.assign(VENTANAS, {
  A1: dia('2026-10-23'), A2: dia('2026-10-24'), A3: dia('2026-10-25'),
  B1: dia('2026-10-28'), B2: dia('2026-10-29'), B3: dia('2026-10-30'),
  C1: dia('2026-10-23'), C2: dia('2026-10-25'), C3: dia('2026-10-28'),
});
export const MAILS_FORMACION = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
export const esFormacion = (codigo) => MAILS_FORMACION.includes(codigo);
const enVentana = (codigo, t) => t >= VENTANAS[codigo][0] && t < VENTANAS[codigo][1];
const ESPERA_POST_RESULTADO = 12 * 3600e3; // quien terminó el diagnóstico hace menos de 12 h ya recibió su invitación en el mail 2
const ESPERA_1A = 2 * 3600e3;
const ESPERA_1B = 12 * 3600e3;
const MAX_POR_CORRIDA = 60;

let resend = null;
const getResend = () => (resend ||= new Resend(process.env.RESEND_API_KEY));

export const normalizar = (e) => String(e || '').trim().toLowerCase();

export function tokenBaja(email) {
  return createHmac('sha256', process.env.ADMIN_KEY || 'sin-clave').update(`baja:${normalizar(email)}`).digest('hex').slice(0, 24);
}
export const linkBaja = (email) => `${SITIO}/api/mails/baja?e=${encodeURIComponent(normalizar(email))}&t=${tokenBaja(email)}`;

let tablasListas = false;
export async function asegurarTablas(db) {
  if (tablasListas) return;
  await asegurarTabla(db);
  await db.query(`CREATE TABLE IF NOT EXISTS mail_envios (
    id SERIAL PRIMARY KEY, email TEXT NOT NULL, mail TEXT NOT NULL, variante TEXT,
    enviado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (email, mail))`);
  await db.query('CREATE TABLE IF NOT EXISTS mail_bajas (email TEXT PRIMARY KEY, fecha TIMESTAMPTZ NOT NULL DEFAULT NOW())');
  await db.query('CREATE TABLE IF NOT EXISTS mail_config (clave TEXT PRIMARY KEY, valor TEXT)');
  await db.query('CREATE TABLE IF NOT EXISTS leads_webinar (id SERIAL PRIMARY KEY, nombre TEXT, email TEXT UNIQUE, fecha TIMESTAMPTZ DEFAULT NOW())');
  await db.query('ALTER TABLE leads_webinar ADD COLUMN IF NOT EXISTS grupo TEXT');
  tablasListas = true;
}

// activoFormacion: el flujo Mail N+C está activo salvo que se pause desde su solapa.
export async function leerConfig(db) {
  const r = await db.query('SELECT clave, valor FROM mail_config');
  const c = Object.fromEntries(r.rows.map((x) => [x.clave, x.valor]));
  return { activo: c.activo === 'true', activoFormacion: c.activo_formacion !== 'false', excluidos: (c.excluidos || '').split(/[\s,;]+/).map(normalizar).filter(Boolean) };
}
export async function guardarConfig(db, clave, valor) {
  await db.query('INSERT INTO mail_config (clave, valor) VALUES ($1,$2) ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor', [clave, valor]);
}

// Casos de prueba y emails del equipo: nunca reciben mails automáticos.
// (dominios de prueba, dominios de una sola letra como a@a.com, emails con "prueba" o "test" y la lista del panel)
export function esExcluido(email, excluidos) {
  const e = normalizar(email);
  return /@(example|test)\.com$/.test(e) || /@[^@.]\.[a-z.]+$/.test(e) || /prueba|test/.test(e) || excluidos.includes(e);
}

// Hora de Argentina: no se envía nada entre las 22 h y las 8 h.
export function horarioPermitido(ahora = new Date()) {
  const h = (ahora.getUTCHours() + 21) % 24;
  return h >= 8 && h < 22;
}

export function variante2(ahora, inscripta) {
  const t = ahora.getTime();
  if (t < CALENDARIO.finMasterclass) return inscripta ? 'B' : t < CALENDARIO.finDosFechas ? 'A' : 'A27';
  return 'C';
}

// Datos del resultado a partir de la fila guardada (se recalcula con sus respuestas).
export function datosResultado(fila) {
  const r = calcularResultado(fila.nombre, String(fila.respuestas).split(''));
  const eje = (id) => r.ejes.find((e) => e.id === id);
  const puntos = r.ejes.reduce((a, e) => a + e.puntos, 0);
  return {
    nombre: primerNombre(fila.nombre), perfil: r.perfil.nombre, total: r.total, puntos, faltan: 30 - puntos,
    orden: eje('orden').porcentaje, foco: eje('foco').porcentaje, seguimiento: eje('seguimiento').porcentaje,
    eje: r.ejes.find((e) => e.id === r.prioritario).nombre, proximo: r.proximo_paso,
  };
}
export function primerNombre(n) {
  const p = String(n || '').trim().split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : 'Hola';
}

// Solo para pruebas locales: MAILS_SIMULAR=true guarda los mails en vez de enviarlos
// y MAILS_AHORA fija la fecha. En producción no se configuran.
export const simulados = [];
const ahoraActual = () => (process.env.MAILS_AHORA ? new Date(process.env.MAILS_AHORA) : new Date());

async function enviar(to, { asunto, html }) {
  if (process.env.MAILS_SIMULAR === 'true') { simulados.push({ to, asunto, html }); return { simulado: true }; }
  const res = await getResend().emails.send({ from: REMITENTE, to, subject: asunto, html });
  if (res?.error) throw new Error(res.error.message || 'Error de Resend');
  return res;
}
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

// Arma la lista de envíos pendientes (sin enviar). Sirve para el panel y para la corrida.
export async function pendientes(db, ahora = ahoraActual()) {
  const t = ahora.getTime();
  const { excluidos } = await leerConfig(db);
  const enviados = new Set((await db.query('SELECT email, mail FROM mail_envios')).rows.map((r) => `${r.email}|${r.mail}`));
  const bajas = new Set((await db.query('SELECT email FROM mail_bajas')).rows.map((r) => r.email));
  const ok = (email, mail) => !esExcluido(email, excluidos) && !bajas.has(email) && !enviados.has(`${email}|${mail}`);

  // Último diagnóstico de cada email.
  const diag = new Map();
  for (const f of (await db.query('SELECT * FROM leads_diagnostico ORDER BY fecha ASC')).rows) diag.set(normalizar(f.email), f);
  const webinar = new Map();
  const webinarFilas = (await db.query('SELECT nombre, email, grupo, fecha FROM leads_webinar ORDER BY fecha ASC')).rows;
  for (const f of webinarFilas) webinar.set(normalizar(f.email), f.grupo || null);
  const envio1A = new Map((await db.query("SELECT email, enviado_en FROM mail_envios WHERE mail = '1A'")).rows.map((r) => [r.email, new Date(r.enviado_en).getTime()]));

  const lista = [];
  const autoActivo = t >= CALENDARIO.inicioAutodiagnostico && t < CALENDARIO.finAutodiagnostico;

  if (autoActivo) {
    // Regla 1: dejó sus datos desde el 8/10 y no terminó el diagnóstico.
    const leads = new Map();
    for (const f of (await db.query('SELECT nombre, email, fecha FROM "Leads" WHERE fecha >= $1 ORDER BY fecha ASC', [new Date(CALENDARIO.inicioAutodiagnostico)])).rows) {
      const e = normalizar(f.email);
      if (!leads.has(e)) leads.set(e, f);
    }
    for (const [e, f] of leads) {
      if (diag.has(e)) continue;
      const desde = new Date(f.fecha).getTime();
      if (!envio1A.has(e) && t - desde >= ESPERA_1A && ok(e, '1A')) lista.push({ email: e, mail: '1A', datos: { nombre: primerNombre(f.nombre) } });
      else if (envio1A.has(e) && t - envio1A.get(e) >= ESPERA_1B && ok(e, '1B')) lista.push({ email: e, mail: '1B', datos: { nombre: primerNombre(f.nombre) } });
    }
    // Regla 2: terminó el diagnóstico desde el 8/10.
    for (const [e, f] of diag) {
      if (new Date(f.fecha).getTime() < CALENDARIO.inicioAutodiagnostico || !ok(e, '2')) continue;
      const inscripta = webinar.has(e);
      const variante = variante2(ahora, inscripta);
      lista.push({ email: e, mail: '2', variante, datos: { ...datosResultado(f), grupo: webinar.get(e) || null, variante } });
    }
  }

  // Regla 3: toda la base de Diagnóstico que no está inscripta a la masterclass.
  // 3A (desde el 20/10) y después los llamados a la acción I1 a I4. Se revisa la base del webinar en cada corrida.
  const r3 = ['3A', 'I1', 'I2', 'I3', 'I4'].find((c) => enVentana(c, t));
  if (r3) {
    for (const [e, f] of diag) {
      if (webinar.has(e) || !ok(e, r3)) continue;
      if (r3 !== '3A' && t - new Date(f.fecha).getTime() < ESPERA_POST_RESULTADO) continue;
      const d = datosResultado(f);
      lista.push({ email: e, mail: r3, datos: { nombre: d.nombre, perfil: d.perfil, eje: d.eje } });
    }
  }

  // Regla 4: recordatorio a quienes ya se anotaron, el día de su fecha a las 10 h.
  // Del 22/10: anotados al 22 y quienes no eligieron grupo. Del 27/10: anotados al 27 y quienes no eligieron.
  const r4 = ['R22', 'R27'].find((c) => enVentana(c, t));
  if (r4) {
    const fecha = r4 === 'R22' ? '22/10' : '27/10';
    const vistos = new Set();
    for (const f of webinarFilas) {
      const e = normalizar(f.email);
      if (vistos.has(e)) continue;
      vistos.add(e);
      const grupo = webinar.get(e);
      if (grupo && grupo !== fecha) continue;
      if (!grupo && new Date(f.fecha).getTime() < CALENDARIO.inicioMasterclass) continue;
      if (!ok(e, r4)) continue;
      lista.push({ email: e, mail: r4, datos: { nombre: primerNombre(f.nombre), fecha, grupo } });
    }
  }

  // Regla 5 · Nutrición para el Entrenamiento (flujo aparte). Nunca a quien ya pagó el Entrenamiento.
  const nutri = MAILS_FORMACION.filter((c) => enVentana(c, t));
  if (nutri.length) {
    let pagaron = new Set();
    try { pagaron = new Set((await db.query('SELECT email FROM leads_formacion WHERE pagado = true')).rows.map((r) => normalizar(r.email))); } catch (e) { /* tabla de Formación no disponible */ }
    for (const codigo of nutri) {
      if (codigo[0] === 'C') {
        // C: base del autodiagnóstico que no se anotó a la masterclass.
        for (const [e, f] of diag) {
          if (webinar.has(e) || pagaron.has(e) || !ok(e, codigo)) continue;
          const d = datosResultado(f);
          lista.push({ email: e, mail: codigo, datos: { nombre: d.nombre, eje: d.eje } });
        }
      } else {
        // A: grupo de la masterclass del 22/10 · B: grupo del 27/10.
        const grupo = codigo[0] === 'A' ? '22/10' : '27/10';
        const vistos = new Set();
        for (const f of webinarFilas) {
          const e = normalizar(f.email);
          if (vistos.has(e)) continue;
          vistos.add(e);
          if (webinar.get(e) !== grupo || pagaron.has(e) || !ok(e, codigo)) continue;
          lista.push({ email: e, mail: codigo, datos: { nombre: primerNombre(f.nombre) } });
        }
      }
    }
  }
  return lista;
}

function armar(item, ahora) {
  const d = { ...item.datos, ahora, linkBaja: linkBaja(item.email) };
  return { '1A': mail1A, '1B': mail1B, '2': mail2, '3A': mail3A, '3B': mail3B, I1: mailI1, I2: mailI2, I3: mailI3, I4: mailI4, R22: mailR, R27: mailR,
    A1: mailA1, A2: mailA2, A3: mailA3, B1: mailB1, B2: mailB2, B3: mailB3, C1: mailC1, C2: mailC2, C3: mailC3 }[item.mail](d);
}

let corriendo = false;
export async function correr({ forzarHorario = false } = {}) {
  if (corriendo) return { ok: false, motivo: 'ya está corriendo' };
  corriendo = true;
  const resultado = { enviados: [], errores: [] };
  try {
    const db = getPool();
    await asegurarTablas(db);
    const { activo, activoFormacion } = await leerConfig(db);
    if (!activo && !activoFormacion) return { ok: true, motivo: 'flujos pausados' };
    const ahora = ahoraActual();
    if (!forzarHorario && !horarioPermitido(ahora)) return { ok: true, motivo: 'fuera de horario (22 a 8 h)' };
    const lista = (await pendientes(db, ahora)).filter((x) => (esFormacion(x.mail) ? activoFormacion : activo)).slice(0, MAX_POR_CORRIDA);
    for (const item of lista) {
      // Se reserva el envío antes de mandarlo: si ya estaba, no se repite.
      const r = await db.query('INSERT INTO mail_envios (email, mail, variante) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING id', [item.email, item.mail, item.variante || null]);
      if (!r.rowCount) continue;
      try {
        await enviar(item.email, armar(item, ahora));
        resultado.enviados.push(`${item.mail} ${item.email}`);
      } catch (err) {
        await db.query('DELETE FROM mail_envios WHERE id = $1', [r.rows[0].id]);
        resultado.errores.push(`${item.mail} ${item.email}: ${err.message}`);
      }
      await pausa(600);
    }
    if (resultado.enviados.length || resultado.errores.length) console.log('mails automáticos:', resultado);
    return { ok: true, ...resultado };
  } catch (e) {
    console.error('mails automáticos: error', e);
    return { ok: false, error: e.message };
  } finally {
    corriendo = false;
  }
}

// Envío de prueba: las piezas vigentes con datos de ejemplo, a una sola casilla. No queda registrado.
export const EJEMPLO = {
  nombre: 'Ana', perfil: 'En construcción', total: 47, puntos: 14, faltan: 16, orden: 60, foco: 50, seguimiento: 30, eje: 'Seguimiento',
  proximo: 'Tu salto está en el Seguimiento: con una forma simple de seguir vas a recuperar conversaciones que hoy se enfrían sin que te des cuenta.', grupo: '22/10',
};
export function piezasPrueba(email) {
  const base = { ...EJEMPLO, ahora: new Date('2026-10-10T15:00:00Z'), linkBaja: linkBaja(email) };
  return [
    ['I1 · 21/10', mailI1(base)], ['I2 · 22/10', mailI2(base)], ['I3 · 26/10', mailI3(base)], ['I4 · 27/10', mailI4(base)],
    ['R22 · anotados 22/10', mailR({ ...base, fecha: '22/10', grupo: '22/10' })], ['R27 · anotados 27/10', mailR({ ...base, fecha: '27/10', grupo: '27/10' })],
    ['R · sin grupo elegido', mailR({ ...base, fecha: '22/10', grupo: null })],
  ];
}
export function piezasPruebaFormacion(email) {
  const base = { ...EJEMPLO, linkBaja: linkBaja(email) };
  return [
    ['A1 · grupo 22/10 · vie 23/10', mailA1(base)], ['A2 · grupo 22/10 · sáb 24/10', mailA2(base)], ['A3 · grupo 22/10 · dom 25/10', mailA3(base)],
    ['B1 · grupo 27/10 · mié 28/10', mailB1(base)], ['B2 · grupo 27/10 · jue 29/10', mailB2(base)], ['B3 · grupo 27/10 · vie 30/10', mailB3(base)],
    ['C1 · autodiag · vie 23/10', mailC1(base)], ['C2 · autodiag · dom 25/10', mailC2(base)], ['C3 · autodiag · mié 28/10', mailC3(base)],
  ];
}
export async function enviarPrueba(email, flujo = 'master') {
  const enviados = [];
  for (const [codigo, m] of (flujo === 'formacion' ? piezasPruebaFormacion(email) : piezasPrueba(email))) {
    await enviar(email, { asunto: `[PRUEBA ${codigo}] ${m.asunto}`, html: m.html });
    enviados.push(codigo);
    await pausa(700);
  }
  return enviados;
}
