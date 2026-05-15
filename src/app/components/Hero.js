'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


function validarEmail(e) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e);
}
function validarNombre(n) {
  return n.trim().length >= 2;
}

export default function Hero() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [errNombre, setErrNombre] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [nombreValido, setNombreValido] = useState(false);
  const [emailValido, setEmailValido] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [primerNombre, setPrimerNombre] = useState('');

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') handleSubmit();
    };
    document.addEventListener('keypress', handler);
    return () => document.removeEventListener('keypress', handler);
  });

  async function handleSubmit() {
    setErrNombre(false);
    setErrEmail(false);

    let ok = true;
    if (!validarNombre(nombre)) {
      setErrNombre(true);
      setNombreValido(false);
      ok = false;
    } else {
      setNombreValido(true);
    }
    if (!validarEmail(email)) {
      setErrEmail(true);
      setEmailValido(false);
      ok = false;
    } else {
      setEmailValido(true);
    }
    if (!ok) return;

    setEnviando(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
      });
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
      }
    } catch (e) {
      console.log(e);
    }

    router.push('/gracias');
  }

  return (
    <section className="hero">
      <div className="barra-izq" />
      <div className="barra-top" />
      <div className="hero-inner">

        {/* Izquierda: texto + formulario */}
        <div className="hero-content">
          <span className="hero-tag">Recurso Gratuito · Autodiagnóstico</span>
          <h1>
            Descubrí cómo está vendiendo hoy <em>tu cerebro</em>
          </h1>
          <p className="hero-sub">
            15 preguntas para saber exactamente qué ajustar en tu canal
            digital — y vender más sin improvisar.
          </p>

          {!enviado ? (
            <div className="hero-form">
              <p className="form-titulo">
                Completá tus datos y descargalo ahora 👇
              </p>
              <div className="form-group">
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu nombre"
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => {
                    if (nombre.trim()) {
                      if (!validarNombre(nombre)) {
                        setErrNombre(true);
                        setNombreValido(false);
                      } else {
                        setErrNombre(false);
                        setNombreValido(true);
                      }
                    }
                  }}
                  className={errNombre ? 'error' : nombreValido ? 'valido' : ''}
                />
                {errNombre && (
                  <span className="error-msg visible">
                    Por favor ingresá tu nombre
                  </span>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  placeholder="Tu email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => {
                    if (email.trim()) {
                      if (!validarEmail(email)) {
                        setErrEmail(true);
                        setEmailValido(false);
                      } else {
                        setErrEmail(false);
                        setEmailValido(true);
                      }
                    }
                  }}
                  className={errEmail ? 'error' : emailValido ? 'valido' : ''}
                />
                {errEmail && (
                  <span className="error-msg visible">
                    Ingresá un email válido (ej: nombre@dominio.com)
                  </span>
                )}
              </div>
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={enviando}
              >
                {enviando ? 'Enviando...' : '→ Quiero mi checklist gratuito'}
              </button>
              <p className="form-privacidad">
                🔒 Sin spam · Descarga inmediata · Es gratis
              </p>
            </div>
          ) : (
            <div className="success-box">
              <div className="check-ico">🎉</div>
              <h3>¡Ya está, {primerNombre}!</h3>
              <p>
                Tu checklist está listo. Hacé clic abajo y empezá tu
                diagnóstico hoy.
              </p>
              <a
                href="https://drive.google.com/file/d/14crpYNXqK4-G4aLPEDPzbhJn8SNWeP-N/view"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                ⬇ Descargar mi Checklist
              </a>
            </div>
          )}
        </div>

        {/* Derecha: foto */}
        <div className="hero-foto">
          <Image
            src="/images/hero-foto.jpg"
            alt="Eva Benavidez"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.92)' }}
            priority
          />
          <div className="hero-foto-badge">
            Checklist
            <br />
            Gratuito ✦
          </div>
        </div>

      </div>
    </section>
  );
}
