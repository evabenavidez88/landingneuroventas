// Al arrancar el servidor, programa la revisión de los mails automáticos cada 10 minutos.
// El motor solo envía si el flujo está activado desde el panel.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.DATABASE_URL) return;
  const { correr } = await import('./lib/mails/motor');
  const MINUTOS = 10;
  setTimeout(() => correr(), 60 * 1000);
  setInterval(() => correr(), MINUTOS * 60 * 1000);
}
