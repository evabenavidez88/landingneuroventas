export function buildEmailHtml(nombre) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tu diagnóstico ya está disponible</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f2f3; font-family: Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f2f3; padding:24px 0;">
<tr>
<td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; max-width:600px; width:100%; border-radius:8px; overflow:hidden;">

<!-- BANNER -->
<tr>
<td style="background-color:#6d3a58; padding:40px 32px; text-align:center;">
<p style="margin:0 0 4px 0; color:#e9d8e2; font-size:12px; letter-spacing:2px; text-transform:uppercase;">Eva Benavidez — Coach &amp; Consultora</p>
<p style="margin:0 0 18px 0; color:#c9a9bd; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Diagnóstico Gratuito · Ventas Digitales</p>
<h1 style="margin:0 0 10px 0; color:#ffffff; font-size:26px; line-height:1.3; font-weight:700;">¿Dónde estás perdiendo ventas sin darte cuenta?</h1>
</td>
</tr>

<!-- CONFIRM BAND -->
<tr>
<td style="background-color:#f0c419; padding:12px 32px; text-align:center;">
<p style="margin:0; color:#3a2a10; font-size:13px; font-weight:700; letter-spacing:0.5px;">✓ TU DIAGNÓSTICO YA ESTÁ DISPONIBLE</p>
</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:32px;">
<p style="margin:0 0 16px 0; font-size:15px; color:#222222; line-height:1.6;">Hola <strong>${nombre}</strong>,</p>
<p style="margin:0 0 16px 0; font-size:15px; color:#222222; line-height:1.6;">✨ ¡Ya es tuyo!</p>
<p style="margin:0 0 16px 0; font-size:15px; color:#222222; line-height:1.6;">Este diagnóstico no es un checklist más. Es una herramienta para que identifiques, en minutos, dónde está la fuga real en tu proceso de venta digital: si es un problema de <strong>orden</strong> (no tenés un proceso claro), de <strong>foco</strong> (estás mirando lo que no importa) o de <strong>seguimiento</strong> (dejás ventas a mitad de camino).</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f5f6; border-left:4px solid #6d3a58; border-radius:4px; margin:20px 0;">
<tr>
<td style="padding:18px 20px;">
<p style="margin:0 0 10px 0; font-size:13px; color:#6d3a58; font-weight:700; letter-spacing:1px; text-transform:uppercase;">👉 ¿Qué sigue ahora?</p>
<p style="margin:0 0 6px 0; font-size:14px; color:#333333; line-height:1.5;">✓ Respondelo hoy, con honestidad, pensando en tu último mes de ventas</p>
<p style="margin:0 0 6px 0; font-size:14px; color:#333333; line-height:1.5;">✓ Identificá cuál de las tres áreas es tu punto más débil</p>
<p style="margin:0; font-size:14px; color:#333333; line-height:1.5;">✓ Guardalo: en los próximos días te voy a mostrar cómo trabajar exactamente sobre eso</p>
</td>
</tr>
</table>

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr>
<td align="center" style="background-color:#6d3a58; border-radius:6px;">
<a href="https://drive.google.com/file/d/1yUxCDVe2rmhHDC3GkYfxPl9lw1rhj_bA/view" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:14px; font-weight:700; text-decoration:none; letter-spacing:0.5px;">HACER MI DIAGNÓSTICO</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- DIVIDER -->
<tr><td style="border-top:1px solid #eeeeee;"></td></tr>

<!-- CONTACT -->
<tr>
<td style="padding:28px 32px; text-align:center;">
<p style="margin:0 0 6px 0; font-size:15px; color:#222222; font-weight:700;">💬 ¿Tenés alguna duda antes de empezar?</p>
<p style="margin:0 0 16px 0; font-size:14px; color:#555555;">Escribile directamente a Eva y te responde ella.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr>
<td align="center" style="border:1px solid #6d3a58; border-radius:6px;">
<a href="https://wa.me/message/X2BA2P356X5DG1" target="_blank" style="display:inline-block; padding:12px 28px; color:#6d3a58; font-size:14px; font-weight:700; text-decoration:none; letter-spacing:0.5px;">ESCRIBIRLE A EVA</a>
</td>
</tr>
</table>
</td>
</tr>

<!-- QUOTE -->
<tr>
<td style="background-color:#f7f5f6; padding:24px 32px; text-align:center;">
<p style="margin:0; font-size:14px; color:#6d3a58; font-style:italic;">"El 90% de la venta es convicción y solo el 10% persuasión."</p>
<p style="margin:6px 0 0 0; font-size:12px; color:#999999;">— Eva Benavidez</p>
</td>
</tr>

<!-- FOOTER CON FIRMA Y FOTO -->
<tr>
<td style="padding:28px 32px;">
<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
<tr>
<td style="padding-right:14px; vertical-align:middle;">
<img src="https://neuroventas.evabenavidez.com/images/email-firma.jpg" width="64" height="64" alt="Eva Benavidez" style="display:block; width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid #f0c419;">
</td>
<td style="vertical-align:middle; text-align:left;">
<p style="margin:0 0 2px 0; font-size:16px; color:#222222; font-weight:700;">Eva Benavidez</p>
<p style="margin:0 0 4px 0; font-size:14px; color:#888888;">Neurocoach · Consultora · Formadora</p>
<p style="margin:0; font-size:11px;">
<a href="https://www.instagram.com/evabenavidez.coach" style="color:#6d3a58; text-decoration:none; margin-right:10px;">📸 Instagram</a>
<a href="https://www.linkedin.com/in/benavidezevangelina/" style="color:#6d3a58; text-decoration:none;">💼 LinkedIn</a>
</p>
</td>
</tr>
</table>
<p style="margin:16px 0 0 0; font-size:11px; color:#aaaaaa; text-align:center;">evabenavidez.com</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>
`;
}
