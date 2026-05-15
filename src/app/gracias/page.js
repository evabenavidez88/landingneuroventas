'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GraciasPage() {
  useEffect(() => {
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead');
    }
  }, []);

  return (
    <div className="gracias-wrap">

      {/* Barra superior amarilla */}
      <div className="barra-top-gracias" />

      {/* Logo */}
      <nav className="gracias-nav">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Eva Benavidez"
            width={120}
            height={56}
            style={{ objectFit: 'contain' }}
          />
        </Link>
      </nav>

      {/* Contenido central */}
      <main className="gracias-main">
        <div className="gracias-card">
          <div className="gracias-icono">🎉</div>
          <h1 className="gracias-titulo">
            ¡Ya está todo listo!
          </h1>
          <p className="gracias-sub">
            Tu <strong>Checklist Neuroventa</strong> está esperándote.<br />
            Descargalo ahora y empezá tu diagnóstico hoy.
          </p>
          <a
            href="https://drive.google.com/file/d/14crpYNXqK4-G4aLPEDPzbhJn8SNWeP-N/view"
            target="_blank"
            rel="noopener noreferrer"
            className="gracias-btn"
          >
            ⬇ Descargar mi Checklist Gratuito
          </a>
          <p className="gracias-nota">
            🔒 Sin spam · Descarga inmediata · Es gratis
          </p>
          <Link href="/" className="gracias-volver">
            ← Volver al inicio
          </Link>
        </div>
      </main>

      <style>{`
        .gracias-wrap {
          min-height: 100vh;
          background: #f8f8f6;
          display: flex;
          flex-direction: column;
          font-family: 'Lato', sans-serif;
          position: relative;
        }
        .barra-top-gracias {
          height: 5px;
          background: #57BDB6;
          width: 100%;
        }
        .gracias-nav {
          background: #ffffff;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gracias-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .gracias-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          max-width: 520px;
          width: 100%;
          text-align: center;
          box-shadow: 0 4px 32px rgba(0,0,0,0.08);
          border-top: 5px solid #57BDB6;
        }
        .gracias-icono {
          font-size: 3.5rem;
          margin-bottom: 1.25rem;
        }
        .gracias-titulo {
          font-family: 'Montserrat', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #0a0a0a;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .gracias-sub {
          font-size: 1.05rem;
          color: #555;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .gracias-btn {
          display: inline-block;
          background: #F3D519;
          color: #0a0a0a;
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          letter-spacing: 0.3px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(243,213,25,0.4);
        }
        .gracias-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(243,213,25,0.5);
        }
        .gracias-nota {
          font-size: 0.8rem;
          color: #999;
          margin-top: 1rem;
        }
        .gracias-volver {
          display: block;
          margin-top: 1.75rem;
          font-size: 0.85rem;
          color: #57BDB6;
          text-decoration: none;
          font-weight: 600;
        }
        .gracias-volver:hover {
          text-decoration: underline;
        }
        @media (max-width: 480px) {
          .gracias-card {
            padding: 2rem 1.5rem;
          }
          .gracias-titulo {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
