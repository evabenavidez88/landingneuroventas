import { getPool } from '../../../../lib/diagnostico';
import { asegurarTablas, tokenBaja, normalizar } from '../../../../lib/mails/motor';

// Link de baja de los mails automáticos.
export const dynamic = 'force-dynamic';

const pagina = (titulo, texto) => new Response(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title></head>
<body style="margin:0;background:#f4f2f3;font-family:Arial,Helvetica,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;box-sizing:border-box">
<div style="background:#fff;max-width:440px;border-radius:12px;padding:36px 28px;text-align:center;border-top:5px solid #6d3a58">
<h1 style="font-size:22px;color:#222;margin:0 0 12px">${titulo}</h1><p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 20px">${texto}</p>
<a href="https://evabenavidez.com" style="color:#6d3a58;font-weight:700;text-decoration:none">evabenavidez.com</a></div></body></html>`,
  { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

export async function GET(request) {
  const url = new URL(request.url);
  const email = normalizar(url.searchParams.get('e'));
  const t = url.searchParams.get('t') || '';
  if (!email || t !== tokenBaja(email)) return pagina('Link no válido', 'No pudimos procesar la baja. Escribinos a info@evabenavidez.com y lo resolvemos.');
  try {
    const db = getPool();
    await asegurarTablas(db);
    await db.query('INSERT INTO mail_bajas (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);
    return pagina('Listo, te diste de baja', 'No vas a recibir más mails automáticos del autodiagnóstico ni de la masterclass.');
  } catch (e) {
    console.error('baja', e);
    return pagina('Algo falló', 'No pudimos procesar la baja. Probá de nuevo en un rato o escribinos a info@evabenavidez.com.');
  }
}
