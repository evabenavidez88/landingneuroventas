import Image from 'next/image';

export default function PresentacionEva() {
  return (
    <section className="presentacion">
      <div className="container">
        <div className="pres-inner">
          <div className="pres-foto">
            <Image
              src="/images/eva-foto.jpg"
              alt="Eva Benavidez"
              width={280}
              height={360}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          <div className="pres-content">
            <span className="tag-label">Soy Eva Benavidez</span>
            <h2>
              El cerebro de tu cliente decide.
              <br />
              <em>Vos podés aprender a acompañar esa decisión.</em>
            </h2>
            <p>
              Hace más de 20 años acompaño a personas y equipos a entender cómo
              se toma una decisión de compra. Y casi siempre veo lo mismo:{' '}
              <strong>el problema no es el producto, es la falta de estructura.</strong>
            </p>
            <p>
              Hoy la IA puede ayudarte a responder más rápido y a sostener más
              conversaciones, pero solo si sabés qué decir y por qué.
            </p>
            <p>
              Este checklist es el primer paso para dejar de improvisar y
              empezar a vender con más conciencia y menos esfuerzo.
            </p>
            <ul className="pres-cifras">
              <li><strong>+20</strong> años de trayectoria</li>
              <li><strong>+1500</strong> personas formadas</li>
              <li><strong>+25</strong> empresas con casos de éxito</li>
            </ul>
            <span className="pres-firma">— Eva Benavidez · Coach &amp; Consultora</span>
          </div>
        </div>
      </div>
    </section>
  );
}
