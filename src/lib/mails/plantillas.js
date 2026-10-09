// Plantillas de los mails automáticos del autodiagnóstico y la masterclass.
// Textos: Eco. Diseño: el mismo del mail de la masterclass (ciruela, banda amarilla, firma de Eva).

export const SITIO = 'https://neuroventas.evabenavidez.com';
const IMG = `${SITIO}/images/mail/`;
const CIR = '#6d3a58';
const AMA = '#f0c419';

export const LINKS = {
  diagnostico: `${SITIO}/diagnostico`,
  masterclass: 'https://neurowebinar.evabenavidez.com/',
  entrenamiento: 'https://neuroformacion.evabenavidez.com/',
  grupos: {
    '22/10': 'https://chat.whatsapp.com/DtzwvS9aFgaGbfKYjO1Efp',
    '27/10': 'https://chat.whatsapp.com/LSt6YbeNgli7BC4uvuDlYU',
  },
  // Si está inscripta pero todavía no eligió grupo: la página de gracias muestra los dos.
  gruposSinElegir: 'https://neurowebinar.evabenavidez.com/gracias',
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const icon = (n, size = 56) => `<img src="${IMG}icono-${n}.png" width="${size}" height="${size}" alt="" style="display:block;width:${size}px;height:${size}px;border:0;">`;
const p = (t, extra = '') => `<p style="margin:0 0 16px 0;font-size:15px;color:#222222;line-height:1.6;${extra}">${t}</p>`;
const chico = (t, extra = '') => `<p style="margin:0 0 8px 0;font-size:14px;color:#333333;line-height:1.55;${extra}">${t}</p>`;
const firmaEva = p('Eva', 'margin:8px 0 0 0;font-weight:700;');
const iconoCentro = (n) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 18px;"><tr><td>${icon(n, 64)}</td></tr></table>`;

function boton(texto, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px auto 20px;"><tr><td align="center" style="background-color:${CIR};border-radius:6px;"><a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 34px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">${esc(texto.toUpperCase())}</a></td></tr></table>`;
}

function caja(titulo, cuerpo, ico, fondo = '#f7f5f6', borde = CIR) {
  const izq = ico ? `<td width="64" style="vertical-align:top;padding:18px 0 18px 18px;">${icon(ico, 48)}</td>` : '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${fondo};border-left:4px solid ${borde};border-radius:4px;margin:0 0 20px 0;"><tr>${izq}<td style="padding:18px 20px;vertical-align:top;">
<p style="margin:0 0 10px 0;font-size:13px;color:${CIR};font-weight:700;letter-spacing:1px;text-transform:uppercase;">${titulo}</p>${cuerpo}</td></tr></table>`;
}

function marco({ titulo, preheader, kicker, h1, sub, banda, cuerpo, linkBaja }) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(titulo)}</title></head>
<body style="margin:0;padding:0;background-color:#f4f2f3;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f2f3;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2f3;padding:24px 0;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;border-radius:8px;overflow:hidden;">
<tr><td style="background-color:${CIR};padding:36px 32px;text-align:center;">
<p style="margin:0 0 4px 0;color:#e9d8e2;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Eva Benavidez — Coach &amp; Consultora</p>
<p style="margin:0 0 16px 0;color:#c9a9bd;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${kicker}</p>
<h1 style="margin:0 0 6px 0;color:#ffffff;font-size:25px;line-height:1.3;font-weight:700;">${h1}</h1>
<p style="margin:0;color:#e9d8e2;font-size:14px;">${sub}</p></td></tr>
<tr><td style="background-color:${AMA};padding:12px 32px;text-align:center;"><p style="margin:0;color:#3a2a10;font-size:13px;font-weight:700;letter-spacing:0.5px;">${banda}</p></td></tr>
<tr><td style="padding:32px;">${cuerpo}</td></tr>
<tr><td style="background-color:#f7f5f6;padding:24px 32px;text-align:center;">
<p style="margin:0;font-size:15px;color:${CIR};font-style:italic;">“Tu cerebro ya sabe cómo vender. Solo necesita orden, foco y dirección.”</p></td></tr>
<tr><td style="padding:26px 32px 10px;"><table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;"><tr>
<td style="padding-right:14px;vertical-align:middle;"><img src="${IMG}firma.jpg" width="64" height="64" alt="Eva Benavidez" style="display:block;width:64px;height:64px;border-radius:50%;border:2px solid ${AMA};"></td>
<td style="vertical-align:middle;text-align:left;"><p style="margin:0 0 2px 0;font-size:16px;color:#222222;font-weight:700;">Eva Benavidez</p>
<p style="margin:0 0 4px 0;font-size:14px;color:#888888;">Coach &amp; Consultora</p>
<p style="margin:0;font-size:12px;"><a href="https://evabenavidez.com" style="color:${CIR};text-decoration:none;margin-right:10px;">evabenavidez.com</a><a href="https://www.instagram.com/evabenavidez.negocios/" style="color:${CIR};text-decoration:none;">@evabenavidez.negocios</a></p></td></tr></table></td></tr>
<tr><td style="padding:10px 32px 28px;text-align:center;"><p style="margin:0;font-size:11px;color:#999999;line-height:1.5;">Recibís este mail porque te registraste en el autodiagnóstico Neuroventa Digital + IA. Si no querés recibir más mails, <a href="${esc(linkBaja)}" style="color:#999999;">darte de baja</a>.</p></td></tr>
</table></td></tr></table></body></html>`;
}

const DIAG_CAB = { kicker: 'Autodiagnóstico gratuito · Ventas digitales', h1: 'Autodiagnóstico Neuroventa Digital + IA' };
const MASTER_CAB = { kicker: 'Masterclass gratuita · Online en vivo', h1: 'Masterclass Neuroventa Digital + IA', sub: 'Tu cliente te escribe, le interesa… y no te compra. ¿Por qué?' };

// d: { nombre, linkBaja, ... } — cada función devuelve { asunto, html }.
export function mail1A(d) {
  const cuerpo = p(`Hola <strong>${esc(d.nombre)}</strong>,`) + iconoCentro('proceso')
    + p('Dejaste tus datos para hacer tu autodiagnóstico, pero todavía no llegaste a tu resultado. Pasa: siempre hay un chat esperando respuesta.')
    + p('Te falta poco. Son 15 preguntas, te lleva unos minutos y ves tu resultado al instante, con tu puntaje en Orden, Foco y Seguimiento.')
    + boton('Retomar mi diagnóstico', LINKS.diagnostico)
    + p('Al entrar, cargás tu nombre y email y arrancás.', 'font-size:13px;color:#666666;text-align:center;') + firmaEva;
  return {
    asunto: `${d.nombre}, te falta poco para ver tu resultado`,
    html: marco({ ...DIAG_CAB, titulo: 'Te falta poco para ver tu resultado', preheader: 'Son 15 preguntas, unos minutos y tu resultado al instante.', sub: '15 preguntas · Resultado al instante', banda: 'TE FALTA POCO PARA VER TU RESULTADO', cuerpo, linkBaja: d.linkBaja }),
  };
}

export function mail1B(d) {
  const conPd = d.ahora < new Date('2026-10-27T21:59:00Z'); // la P.D. sale hasta el martes 27/10 a las 18:59 (ARG)
  const cuerpo = p(`Hola <strong>${esc(d.nombre)}</strong>,`)
    + p('Te escribo una vez más porque este diagnóstico tiene algo valioso: no te dice solo cómo estás, te dice por dónde empezar.')
    + caja('Lo que ves al terminar', chico('En cuál de tus tres ejes (Orden, Foco o Seguimiento) se te escapan más ventas hoy, y cuál es tu próximo paso concreto.', 'margin:0;'), 'claridad')
    + p('Son 15 preguntas. Lo podés hacer ahora, entre una consulta y otra.')
    + boton('Retomar mi diagnóstico', LINKS.diagnostico) + firmaEva
    + (conPd ? p('<strong>P.D.:</strong> Si llegás a la masterclass sabiendo cuál es tu eje, la vas a aprovechar mucho más.', 'font-size:14px;color:#555555;margin:16px 0 0 0;') : '');
  return {
    asunto: '¿Dónde se te escapan las ventas?',
    html: marco({ ...DIAG_CAB, titulo: '¿Dónde se te escapan las ventas?', preheader: 'Tu resultado te dice por cuál de los 3 ejes empezar. Te lleva unos minutos.', sub: '15 preguntas · Resultado al instante', banda: 'TU RESULTADO TE DICE POR DÓNDE EMPEZAR', cuerpo, linkBaja: d.linkBaja }),
  };
}

function barra(nombre, pct, ico) {
  const col = pct < 40 ? '#865273' : '#57bdb6';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;"><tr>
<td width="44" style="vertical-align:middle;">${icon(ico, 36)}</td>
<td style="vertical-align:middle;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:14px;color:#222222;font-weight:700;padding-bottom:5px;">${nombre}</td><td align="right" style="font-size:14px;color:#222222;font-weight:700;padding-bottom:5px;">${pct}%</td></tr>
<tr><td colspan="2" style="background-color:#ecebe6;border-radius:99px;height:8px;line-height:8px;font-size:0;"><table role="presentation" width="${Math.max(4, pct)}%" cellpadding="0" cellspacing="0"><tr><td style="background-color:${col};border-radius:99px;height:8px;line-height:8px;font-size:0;">&nbsp;</td></tr></table></td></tr></table></td></tr></table>`;
}

function invitacion(v, d) {
  const eje = `<strong>${esc(d.eje)}</strong>`;
  const masterTxt = chico(`En la Masterclass Neuroventa Digital + IA te muestro cómo se trabaja ${eje} dentro del chat, y cómo la IA te ayuda a ordenar tu proceso sin perder lo humano.`);
  if (v === 'A') return caja('Tu próximo paso, en vivo', masterTxt + chico('<strong>Jueves 22/10 o martes 27/10 · 19 h (ARG)</strong><br>Gratis · En vivo · No se graba', 'margin:0;'), 'negocio', '#fdf8e1', AMA) + boton('Reservar mi lugar gratis', LINKS.masterclass);
  if (v === 'A27') return caja('Tu próximo paso, en vivo', masterTxt + chico('<strong>Martes 27/10 · 19 h (ARG) · Última fecha</strong><br>Gratis · En vivo · No se graba', 'margin:0;'), 'negocio', '#fdf8e1', AMA) + boton('Reservar mi lugar gratis', LINKS.masterclass);
  if (v === 'B') {
    const fecha = d.grupo ? `el ${d.grupo}` : 'en la masterclass';
    const cuando = d.grupo ? `<strong>${d.grupo} a las 19 h (ARG)</strong>` : '<strong>jueves 22/10 o martes 27/10 a las 19 h (ARG)</strong>';
    return caja(`Te esperamos ${fecha}`, chico(`Ya tenés tu lugar en la masterclass: ${cuando}. Llegás sabiendo cuál es tu eje, así que la vas a aprovechar al máximo.`)
      + chico('Si todavía no entraste al grupo de WhatsApp de tu fecha, sumate: ahí te dejo el link de acceso y los recordatorios.', 'margin:0;'), 'negocio', '#fdf8e1', AMA)
      + boton('Ir a mi grupo de WhatsApp', d.grupo ? LINKS.grupos[d.grupo] : LINKS.gruposSinElegir);
  }
  return caja('Tu próximo paso: el método completo', chico('En el Entrenamiento Neuroventa Digital + IA trabajás Orden, Foco y Seguimiento sobre tu propio negocio, en 3 encuentros en vivo, con la IA como aliada para ordenar tu proceso sin perder lo humano.')
    + chico('<strong>Empezamos el martes 3/11 · 19 h (ARG)</strong><br>Con grabaciones y garantía de 15 días', 'margin:0;'), 'negocio', '#fdf8e1', AMA) + boton('Quiero inscribirme', LINKS.entrenamiento);
}

// d: { nombre, perfil, total, puntos, faltan, orden, foco, seguimiento, eje, proximo, grupo, variante, linkBaja }
export function mail2(d) {
  const resultado = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CIR};border-radius:8px;margin:0 0 20px 0;"><tr><td style="padding:22px 24px;">
<p style="margin:0 0 6px 0;font-size:11px;color:#3a2a10;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;"><span style="background-color:${AMA};border-radius:99px;padding:4px 10px;">Tu resultado</span></p>
<p style="margin:10px 0 8px 0;font-size:24px;color:#ffffff;font-weight:700;">${esc(d.perfil)}</p>
<p style="margin:0;font-size:14.5px;color:#f1e6ec;line-height:1.55;">Tus canales digitales están al <strong style="color:#ffffff;">${d.total}%</strong>. Alcanzaste ${d.puntos} de 30 puntos${d.faltan > 0 ? ` y estás a ${d.faltan} ${d.faltan === 1 ? 'punto' : 'puntos'} de tu mejor versión` : ''}.</p></td></tr></table>`;
  const ejes = barra('Orden', d.orden, 'proceso') + barra('Foco', d.foco, 'claridad') + barra('Seguimiento', d.seguimiento, 'canales');
  const cuerpo = p(`Hola <strong>${esc(d.nombre)}</strong>,`) + iconoCentro('energia')
    + p('¡Lo hiciste! Gracias por darte este tiempo. Mirar tu proceso en lugar de seguir apagando incendios ya es un paso que muchas personas no dan.')
    + resultado
    + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px 0;"><tr><td>${ejes}</td></tr></table>`
    + caja(`Tu eje para empezar: ${esc(d.eje)}`, chico(`<strong>Tu próximo paso:</strong> ${esc(d.proximo)}`, 'margin:0;'), 'alerta')
    + p('La buena noticia: ya sabés por dónde empezar.', 'font-weight:700;')
    + invitacion(d.variante, d)
    + p('Esto no es magia, es método. Y se entrena.', `font-style:italic;color:${CIR};`) + p('Eva', 'margin:0;font-weight:700;');
  return {
    asunto: `${d.nombre}, este es tu resultado`,
    html: marco({ ...DIAG_CAB, titulo: 'Este es tu resultado', preheader: `Tus canales digitales están al ${d.total}%. Mirá por dónde empezar.`, sub: 'Tu resultado, por escrito', banda: '✓ TU DIAGNÓSTICO ESTÁ COMPLETO', cuerpo, linkBaja: d.linkBaja }),
  };
}

export function mail3A(d) {
  const eje = `<strong>${esc(d.eje)}</strong>`;
  const cuerpo = p(`Hola <strong>${esc(d.nombre)}</strong>,`) + iconoCentro('alerta')
    + p(`Cuando hiciste tu autodiagnóstico, tu resultado fue <strong>${esc(d.perfil)}</strong> y tu eje para empezar es ${eje}.`)
    + caja('Masterclass gratuita · En vivo', chico(`Este <strong>jueves 22/10 a las 19 h (ARG)</strong> hago la Masterclass Neuroventa Digital + IA. Vas a ver por qué tu cliente duda aunque le interese, cómo se trabaja ${eje} dentro del chat y cómo la IA te ayuda a ordenar tu proceso sin perder lo humano.`, 'margin:0;'), 'negocio', '#fdf8e1', AMA)
    + p('Si el jueves no podés, la repito el martes 27/10 a la misma hora.')
    + boton('Reservar mi lugar gratis', LINKS.masterclass) + p('Eva', 'margin:0;font-weight:700;');
  return {
    asunto: `${d.nombre}, el jueves trabajamos tu eje en vivo`,
    html: marco({ ...MASTER_CAB, titulo: 'El jueves trabajamos tu eje en vivo', preheader: 'Masterclass gratuita: jueves 22/10 a las 19 h. Si no podés, hay otra fecha.', banda: 'JUEVES 22/10 · 19 H (ARG) · GRATIS Y EN VIVO', cuerpo, linkBaja: d.linkBaja }),
  };
}

export function mail3B(d) {
  const cuerpo = p(`Hola <strong>${esc(d.nombre)}</strong>,`) + iconoCentro('alerta')
    + p('El <strong>martes 27/10 a las 19 h (ARG)</strong> es la última fecha de la Masterclass Neuroventa Digital + IA.')
    + caja(`Tu eje para empezar: ${esc(d.eje)}`, chico('En esta hora vas a ver cómo trabajarlo en tus conversaciones por WhatsApp y redes, y cómo la IA te ayuda a sostenerlo sin perder lo humano.', 'margin:0;'), 'negocio', '#fdf8e1', AMA)
    + p('Es gratis, es en vivo y no se graba. Si querés estar, este es el momento de reservar tu lugar.')
    + boton('Reservar mi lugar gratis', LINKS.masterclass) + p('Eva', 'margin:0;font-weight:700;');
  return {
    asunto: 'Última fecha: el martes trabajamos tu eje',
    html: marco({ ...MASTER_CAB, titulo: 'Última fecha: el martes trabajamos tu eje', preheader: 'Gratis y en vivo: martes 27/10 a las 19 h. Es la última fecha.', banda: 'ÚLTIMA FECHA · MARTES 27/10 · 19 H (ARG)', cuerpo, linkBaja: d.linkBaja }),
  };
}
