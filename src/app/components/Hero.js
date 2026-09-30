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

    try {
      sessionStorage.setItem('checklist_nombre', nombre.trim().split(' ')[0]);
    } catch (e) {}
    router.push('/gracias');
  }

  return (
    <section className="hero" id="checklist">
      <div className="barra-izq" />
      <div className="barra-top" />
      <div className="hero-inner">

        {/* Izquierda: texto + formulario */}
        <div className="hero-content">
          <span className="hero-tag">Recurso Gratuito · Autodiagnóstico</span>
          <h1>
            ¿Te escriben por WhatsApp y redes, pero no te compran?
            <span className="h1-linea2">
              Descubrí dónde <em>tu cerebro</em> pierde esas ventas.
            </span>
          </h1>
          <p className="hero-sub">
            15 preguntas para diagnosticar tu canal digital en 3 ejes (Orden,
            Foco y Seguimiento) y saber qué ajustar primero, antes de sumar IA.
          </p>
          <p className="hero-respaldo">
            Creado por Eva Benavidez · +20 años · +1500 personas formadas
          </p>

          {!enviado ? (
            <div className="hero-form">
              <p className="form-titulo">
                Dejame tus datos y te llega al instante.
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
                {enviando ? 'Enviando...' : 'Quiero mi checklist'}
              </button>
              <p className="form-privacidad">
                Gratis · Sin spam · Descarga inmediata
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
                href="https://drive.google.com/file/d/1yUxCDVe2rmhHDC3GkYfxPl9lw1rhj_bA/view"
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
            Gratuito
          </div>
        </div>

      </div>
    </section>
  );
}
