'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [errorAuth, setErrorAuth] = useState('');
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [source, setSource] = useState('checklist');
  const keyRef = useRef('');

  const fetchLeads = useCallback(async (adminKey, src) => {
    const param = src === 'checklist' ? '' : `?source=${src}`;
    const res = await fetch(`/api/leads${param}`, { headers: { 'x-admin-key': adminKey } });
    if (res.ok) setLeads(await res.json());
  }, []);

  useEffect(() => {
    if (!autenticado) return;
    fetchLeads(keyRef.current, source);
  }, [source, autenticado, fetchLeads]);

  useEffect(() => {
    if (!autenticado) return;
    const interval = setInterval(() => fetchLeads(keyRef.current, source), 30000);
    return () => clearInterval(interval);
  }, [autenticado, source, fetchLeads]);

  async function login() {
    setCargando(true);
    setErrorAuth('');
    try {
      const res = await fetch('/api/leads', { headers: { 'x-admin-key': key } });
      if (res.ok) {
        setLeads(await res.json());
        keyRef.current = key;
        setAutenticado(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorAuth(res.status === 401 ? 'Contraseña incorrecta' : `Error ${res.status}: ${data.error || 'Error de servidor'}`);
      }
    } catch {
      setErrorAuth('Error de conexión');
    }
    setCargando(false);
  }

  function exportarExcel() {
    const nombre = source === 'webinar' ? 'leads-webinar' : source === 'formacion' ? 'leads-formacion' : 'leads-checklist';
    const filas = leads.map(l => source === 'formacion'
      ? { ID: l.id, Nombre: l.nombre, Apellido: l.apellido || '', Email: l.email, Fecha: new Date(l.fecha).toLocaleString('es-AR', { hour12: false }) }
      : { ID: l.id, Nombre: l.nombre, Email: l.email, Fecha: new Date(l.fecha).toLocaleString('es-AR', { hour12: false }) }
    );
    const ws = XLSX.utils.json_to_sheet(filas);
    ws['!cols'] = source === 'formacion'
      ? [{ wch: 6 }, { wch: 20 }, { wch: 20 }, { wch: 35 }, { wch: 20 }]
      : [{ wch: 6 }, { wch: 25 }, { wch: 35 }, { wch: 20 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `${nombre}-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  const hoy = leads.filter(l => {
    const d = new Date(l.fecha);
    return d.toDateString() === new Date().toDateString();
  }).length;

  const estaSemana = leads.filter(l => {
    const d = new Date(l.fecha);
    return (Date.now() - d) / (1000 * 60 * 60 * 24) <= 7;
  }).length;

  const chartData = (() => {
    const days = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      days[k] = 0;
    }
    leads.forEach(l => {
      const k = new Date(l.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      if (k in days) days[k]++;
    });
    return Object.entries(days).map(([fecha, cantidad]) => ({ fecha, cantidad }));
  })();

  const leadsFiltrados = leads.filter(l =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!autenticado) {
    return (
      <div style={s.loginWrap}>
        <div style={s.loginBox}>
          <div style={s.loginLogo}>⚡</div>
          <h2 style={s.loginTitle}>Panel de Leads</h2>
          <p style={s.loginSub}>NeuroCienciaEva</p>
          <input
            type="password"
            placeholder="Contraseña"
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={s.input}
          />
          {errorAuth && <p style={s.errorMsg}>{errorAuth}</p>}
          <button onClick={login} disabled={cargando} style={s.btn}>
            {cargando ? 'Verificando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div>
          <h1 style={s.titulo}>Panel de Leads</h1>
          <p style={s.subtitulo}>NeuroCienciaEva</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={s.selector}>
            <button
              onClick={() => setSource('checklist')}
              style={{ ...s.selectorBtn, ...(source === 'checklist' ? s.selectorActive : {}) }}
            >
              📋 Checklist
            </button>
            <button
              onClick={() => setSource('webinar')}
              style={{ ...s.selectorBtn, ...(source === 'webinar' ? s.selectorActive : {}) }}
            >
              🎓 Webinar
            </button>
            <button
              onClick={() => setSource('formacion')}
              style={{ ...s.selectorBtn, ...(source === 'formacion' ? s.selectorActive : {}) }}
            >
              💰 Formación
            </button>
          </div>
          <button onClick={exportarExcel} style={s.btnExport}>⬇ Exportar Excel</button>
        </div>
      </header>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <span style={s.statNum}>{leads.length}</span>
          <span style={s.statLabel}>Total leads</span>
        </div>
        <div style={s.statCard}>
          <span style={{ ...s.statNum, color: '#a78bfa' }}>+{estaSemana}</span>
          <span style={s.statLabel}>Esta semana</span>
        </div>
        <div style={s.statCard}>
          <span style={{ ...s.statNum, color: '#4ade80' }}>+{hoy}</span>
          <span style={s.statLabel}>Hoy</span>
        </div>
      </div>

      <div style={s.chartBox}>
        <h3 style={s.chartTitle}>Leads por día — últimos 14 días</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" />
            <XAxis dataKey="fecha" tick={{ fill: '#888', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#888', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#16162a', border: '1px solid #6c3ce1', color: '#fff', borderRadius: '8px' }}
              cursor={{ fill: 'rgba(108,60,225,0.1)' }}
            />
            <Bar dataKey="cantidad" name="Leads" fill="#6c3ce1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={s.tableBox}>
        <div style={s.tableHeader}>
          <span style={s.tableCount}>{leadsFiltrados.length} registros</span>
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={s.search}
          />
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>#</th>
                <th style={s.th}>Nombre</th>
                {source === 'formacion' && <th style={s.th}>Apellido</th>}
                <th style={s.th}>Email</th>
                <th style={s.th}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {leadsFiltrados.map((l, i) => (
                <tr key={l.id} style={i % 2 === 0 ? s.trEven : s.trOdd}>
                  <td style={s.tdMuted}>{l.id}</td>
                  <td style={s.td}>{l.nombre}</td>
                  {source === 'formacion' && <td style={s.td}>{l.apellido}</td>}
                  <td style={s.tdEmail}>{l.email}</td>
                  <td style={s.tdMuted}>{new Date(l.fecha).toLocaleString('es-AR', { hour12: false })}</td>
                </tr>
              ))}
              {leadsFiltrados.length === 0 && (
                <tr>
                  <td colSpan={source === 'formacion' ? 5 : 4} style={{ ...s.td, textAlign: 'center', color: '#555', padding: '2rem' }}>
                    Sin resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a14', fontFamily: 'system-ui, sans-serif' },
  loginBox: { background: '#13132a', padding: '2.5rem', borderRadius: '16px', width: '340px', textAlign: 'center', border: '1px solid #2a2a4a', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' },
  loginLogo: { fontSize: '2rem', marginBottom: '0.5rem' },
  loginTitle: { color: '#fff', margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700 },
  loginSub: { color: '#666', marginBottom: '1.75rem', fontSize: '0.85rem' },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #3a3a5a', background: '#0a0a14', color: '#fff', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box', outline: 'none' },
  errorMsg: { color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem', marginTop: 0 },
  btn: { width: '100%', padding: '0.75rem', background: '#6c3ce1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', fontWeight: 600 },
  wrap: { minHeight: '100vh', background: '#0a0a14', color: '#fff', padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  titulo: { fontSize: '1.75rem', fontWeight: 700, margin: 0 },
  subtitulo: { color: '#666', fontSize: '0.85rem', margin: '0.25rem 0 0' },
  btnExport: { background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid #4ade80', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 },
  selector: { display: 'flex', background: '#13132a', border: '1px solid #2a2a4a', borderRadius: '8px', overflow: 'hidden' },
  selectorBtn: { padding: '0.5rem 1.1rem', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 },
  selectorActive: { background: '#6c3ce1', color: '#fff' },
  statsRow: { display: 'flex', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { flex: 1, background: '#13132a', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', border: '1px solid #2a2a4a' },
  statNum: { display: 'block', fontSize: '2.5rem', fontWeight: 700, color: '#fff' },
  statLabel: { color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  chartBox: { background: '#13132a', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #2a2a4a' },
  chartTitle: { color: '#aaa', margin: '0 0 1.25rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  tableBox: { background: '#13132a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #2a2a4a' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' },
  tableCount: { color: '#666', fontSize: '0.85rem' },
  search: { padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #3a3a5a', background: '#0a0a14', color: '#fff', fontSize: '0.9rem', minWidth: '260px', outline: 'none' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  th: { textAlign: 'left', padding: '0.65rem 1rem', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #2a2a4a' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#ddd' },
  tdMuted: { padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#666' },
  tdEmail: { padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#a78bfa', fontFamily: 'monospace' },
  trEven: { borderBottom: '1px solid #1a1a30' },
  trOdd: { background: '#0f0f22', borderBottom: '1px solid #1a1a30' },
};
