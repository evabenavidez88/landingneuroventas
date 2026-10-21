'use client';
import { useCallback, useEffect, useState } from 'react';

const MAILS = [
  { id: '1A', nombre: 'Terminá tu diagnóstico · primer aviso', cuando: '2 h después de dejar sus datos', quien: 'Dejó sus datos desde el 8/10 y no terminó el diagnóstico' },
  { id: '1B', nombre: 'Terminá tu diagnóstico · segundo aviso', cuando: '12 h después del primer aviso', quien: 'Recibió el 1A y sigue sin terminar' },
  { id: '2', nombre: 'Tu resultado', cuando: 'Al terminar el diagnóstico', quien: 'Terminó el diagnóstico desde el 8/10' },
  { id: '3A', nombre: 'Recordatorio masterclass 22/10', cuando: 'Martes 20/10 · 19 h (ya salió)', quien: 'Autodiagnóstico, no anotados a la masterclass' },
  { id: 'I1', nombre: 'Masterclass: mañana, elegí tu fecha (no anotados)', cuando: 'Miércoles 21/10 · 10 h', quien: 'Autodiagnóstico, no anotados a la masterclass' },
  { id: 'I2', nombre: 'Masterclass: hoy 19 h (no anotados)', cuando: 'Jueves 22/10 · 10 h', quien: 'Autodiagnóstico, no anotados a la masterclass' },
  { id: 'I3', nombre: 'Masterclass: mañana última fecha (no anotados)', cuando: 'Lunes 26/10 · 10 h', quien: 'Autodiagnóstico, no anotados a la masterclass' },
  { id: 'I4', nombre: 'Masterclass: hoy última fecha (no anotados)', cuando: 'Martes 27/10 · 10 h', quien: 'Autodiagnóstico, no anotados a la masterclass' },
  { id: 'R22', nombre: 'Recordatorio a anotados del 22/10', cuando: 'Jueves 22/10 · 10 h', quien: 'Anotados al 22/10 + anotados sin grupo' },
  { id: 'R27', nombre: 'Recordatorio a anotados del 27/10', cuando: 'Martes 27/10 · 10 h', quien: 'Anotados al 27/10 + anotados sin grupo' },
];

export default function MailsPanel({ adminKey, s }) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [emailPrueba, setEmailPrueba] = useState('benavidezevangelina@gmail.com');
  const [excluidos, setExcluidos] = useState('');

  const cargar = useCallback(async () => {
    const res = await fetch('/api/mails', { headers: { 'x-admin-key': adminKey } });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setError(d.error || `Error ${res.status}`); return; }
    setDatos(d); setExcluidos((d.excluidos || []).join('\n')); setError('');
  }, [adminKey]);

  useEffect(() => { cargar(); const t = setInterval(cargar, 60000); return () => clearInterval(t); }, [cargar]);

  async function accion(body, ok) {
    setOcupado(true); setAviso(''); setError('');
    try {
      const res = await fetch('/api/mails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(body) });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || `Error ${res.status}`);
      setDatos(d); setExcluidos((d.excluidos || []).join('\n')); setAviso(ok(d));
    } catch (e) { setError(e.message); }
    setOcupado(false);
  }

  if (error && !datos) return <div style={s.tableBox}><p style={{ color: '#f87171' }}>{error}</p></div>;
  if (!datos) return <div style={s.tableBox}><p style={{ color: '#888' }}>Cargando…</p></div>;

  const totalPend = Object.values(datos.pendientes).reduce((a, b) => a + b, 0);
  const caja = { ...s.tableBox, marginBottom: '1.5rem' };
  const btn = (color) => ({ ...s.btn, width: 'auto', padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: color, opacity: ocupado ? 0.6 : 1 });

  return (
    <>
      <div style={caja}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ ...s.chartTitle, margin: 0 }}>Flujo de mails automáticos</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.1rem', fontWeight: 700, color: datos.activo ? '#4ade80' : '#fbbf24' }}>
              {datos.activo ? 'Activo · revisa cada 10 minutos' : 'Pausado · no se envía nada'}
            </p>
            <p style={{ margin: '0.35rem 0 0', color: '#888', fontSize: '0.85rem' }}>
              {totalPend} envíos listos para salir {datos.activo ? 'en la próxima revisión (de 8 a 22 h)' : 'cuando se active'} · {datos.bajas} bajas
            </p>
          </div>
          <button disabled={ocupado} style={btn(datos.activo ? '#b45309' : '#16a34a')}
            onClick={() => {
              if (!datos.activo && !window.confirm(`Se activa el flujo: en la próxima revisión salen ${totalPend} mails reales. ¿Activar?`)) return;
              accion({ accion: datos.activo ? 'pausar' : 'activar' }, (d) => (d.activo ? 'Flujo activado.' : 'Flujo pausado.'));
            }}>
            {datos.activo ? 'Pausar flujo' : 'Activar flujo'}
          </button>
        </div>
        {aviso && <p style={{ color: '#4ade80', margin: '1rem 0 0' }}>{aviso}</p>}
        {error && <p style={{ color: '#f87171', margin: '1rem 0 0' }}>{error}</p>}
      </div>

      <div style={caja}>
        <h3 style={s.chartTitle}>Envío de prueba</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Manda las piezas nuevas de la masterclass (I1 a I4 y recordatorios a anotados) con datos de ejemplo (Ana, eje Seguimiento). El asunto dice [PRUEBA]. No cuenta como envío real.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input type="email" value={emailPrueba} onChange={(e) => setEmailPrueba(e.target.value)} style={{ ...s.search, minWidth: '300px' }} />
          <button disabled={ocupado} style={btn('#6c3ce1')}
            onClick={() => accion({ accion: 'prueba', email: emailPrueba }, (d) => `Listo: se enviaron ${d.prueba.length} mails de prueba a ${d.email}.`)}>
            {ocupado ? 'Enviando…' : 'Enviar prueba'}
          </button>
        </div>
      </div>

      <div style={caja}>
        <h3 style={s.chartTitle}>Mails</h3>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Mail</th><th style={s.th}>A quién</th><th style={s.th}>Cuándo sale</th><th style={s.th}>Enviados</th><th style={s.th}>Listos para salir</th></tr></thead>
            <tbody>
              {MAILS.map((m, i) => (
                <tr key={m.id} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                  <td style={s.td}><b>{m.id}</b> · {m.nombre}</td>
                  <td style={s.tdMuted}>{m.quien}</td>
                  <td style={s.tdMuted}>{m.cuando}</td>
                  <td style={s.td}>{datos.enviados[m.id] || 0}</td>
                  <td style={s.td}>{datos.pendientes[m.id] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul style={{ color: '#aaa', fontSize: '0.85rem', margin: '1rem 0 0', paddingLeft: '1.1rem', lineHeight: 1.6 }}>
          <li>Cada mail sale una sola vez por persona (los emails repetidos cuentan como uno).</li>
          <li>Nunca les llega a los excluidos, a quienes se dieron de baja ni a los casos de prueba.</li>
          <li>Solo se envía entre las 8 y las 22 h. El sistema revisa cada 10 minutos.</li>
          <li>I1 a I4: antes de cada envío se revisa la base del webinar; quien se anotó deja de recibirlos. Quien terminó el diagnóstico hace menos de 12 h se saltea ese mail.</li>
          <li>R22 y R27: con grupo elegido, botón a su grupo; sin grupo, botón para elegirlo. Cuentan las inscripciones desde el 1/10.</li>
          <li>Cada mail tiene su ventana: si no salió en su día (I2, I4, R22 y R27 hasta las 19 h), ya no sale.</li>
        </ul>
      </div>

      <div style={s.tableBox}>
        <h3 style={s.chartTitle}>Emails excluidos (equipo)</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>Uno por línea. Además quedan afuera siempre: example.com, test.com, dominios de una sola letra (como a@a.com) y los emails que contienen "prueba" o "test".</p>
        <textarea value={excluidos} onChange={(e) => setExcluidos(e.target.value)} rows={5}
          style={{ ...s.search, width: '100%', minWidth: 0, fontFamily: 'monospace', boxSizing: 'border-box' }} />
        <button disabled={ocupado} style={{ ...btn('#6c3ce1'), marginTop: '0.75rem' }}
          onClick={() => accion({ accion: 'excluidos', excluidos }, () => 'Lista de excluidos guardada.')}>Guardar lista</button>
      </div>
    </>
  );
}
