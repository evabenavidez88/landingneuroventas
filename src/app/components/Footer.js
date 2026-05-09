import Image from 'next/image';

export default function Footer() {
  return (
    <>
      <div className="footer-wave">
        <svg
          viewBox="0 0 1440 50"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,25 C360,50 720,0 1080,25 C1260,38 1380,10 1440,25 L1440,50 L0,50 Z"
            fill="#F3D519"
          />
        </svg>
      </div>
      <div className="footer-amarillo">
        <Image
          src="/images/logo-footer.png"
          alt="Eva Benavidez"
          width={180}
          height={70}
          className="footer-logo"
          style={{ height: '70px', width: 'auto' }}
        />
        <p className="footer-frase">¡Sí! Podemos lograrlo juntos</p>
        <div className="footer-redes">
          <a
            href="https://www.instagram.com/evabenavidez.coach"
            target="_blank"
            rel="noopener noreferrer"
            className="red-btn"
            aria-label="Instagram"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="#0a0a0a" stroke="none" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/benavidezevangelina/"
            target="_blank"
            rel="noopener noreferrer"
            className="red-btn"
            aria-label="LinkedIn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a0a0a">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
        <p className="footer-copy">
          © 2025 Eva Benavidez · Coach &amp; Consultora ·{' '}
          <a href="https://evabenavidez.com">evabenavidez.com</a>
        </p>
      </div>
    </>
  );
}
