'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Completar antes de publicar: horario de la masterclass (ARG).
const HORA_MASTERCLASS = '[HORA]';
const URL_MASTERCLASS = 'https://neurowebinar.evabenavidez.com/';

export default function GraciasPage() {
  const [nombre, setNombre] = useState('');

  // El evento Lead del píxel se registra al enviar el formulario (Hero.js).
  useEffect(() => {
    try {
      setNombre(sessionStorage.getItem('checklist_nombre') || '');
    } catch (e) {}
  }, []);

  return (
    <div className="gracias-wrap">

      {/* Barra superior */}
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
          <h1 className="gracias-titulo">
            Listo{nombre ? `, ${nombre}` : ''}. Tu checklist ya está en tu email.
          </h1>
          <p className="gracias-sub">
            Revisá también spam o promociones, por las dudas.
          </p>

          <div className="gracias-invitacion">
            <p className="gracias-invitacion-titulo">
              Mientras lo respondés, te hago una invitación:
            </p>
            <p className="gracias-invitacion-texto">
              Hago la <strong>Masterclass Neuroventa Digital + IA</strong>, gratuita y en
              vivo, en dos fechas: <strong>jueves 22 de octubre</strong> o{' '}
              <strong>martes 27 de octubre de 2026</strong>, a las{' '}
              {HORA_MASTERCLASS} hs (ARG). Vamos a ver por qué tu cliente duda
              aunque le interese, y cómo usar la IA para responderle mejor sin
              perder lo humano.
            </p>
            <a
              href={URL_MASTERCLASS}
              target="_blank"
              rel="noopener noreferrer"
              className="gracias-btn"
            >
              Reservar mi lugar gratis
            </a>
          </div>

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
        .gracias-invitacion {
          border-top: 1px solid rgba(0,0,0,0.08);
          padding-top: 1.75rem;
          text-align: left;
        }
        .gracias-invitacion-titulo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          font-size: 1rem;
          color: #0a0a0a;
          margin-bottom: 0.6rem;
        }
        .gracias-invitacion-texto {
          font-size: 0.98rem;
          color: #555;
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }
        .gracias-invitacion-texto strong { color: #0a0a0a; }
        .gracias-invitacion .gracias-btn { display: block; text-align: center; }
        .gracias-titulo {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.75rem;
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
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
