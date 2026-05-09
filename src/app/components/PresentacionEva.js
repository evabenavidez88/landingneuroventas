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
              Tu cerebro ya sabe cómo vender.
              <br />
              <em>Solo necesita orden, foco y dirección.</em>
            </h2>
            <p>
              Hace más de 20 años acompaño a personas y equipos a entender cómo
              funciona realmente la decisión de compra.
            </p>
            <p>
              Y lo que más me sorprende siempre es esto:{' '}
              <strong>el problema casi nunca es el producto.</strong>
            </p>
            <p>
              Es la falta de estructura. Y eso —{' '}
              <em>eso sí se puede transformar.</em>
            </p>
            <p>
              Este checklist es el primer paso para que dejes de improvisar y
              empieces a vender con más conciencia y menos esfuerzo.
            </p>
            <span className="pres-firma">— Eva Benavidez · Coach &amp; Consultora</span>
          </div>
        </div>
      </div>
    </section>
  );
}
