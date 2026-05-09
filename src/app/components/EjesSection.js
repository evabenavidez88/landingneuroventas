import Image from 'next/image';

const ejes = [
  {
    icon: '/images/icon-eje-orden.png',
    title: 'Orden',
    desc: 'Base operativa de tu canal digital',
  },
  {
    icon: '/images/icon-eje-foco.png',
    title: 'Foco',
    desc: 'Emoción y valor. La activación del inconsciente.',
  },
  {
    icon: '/images/icon-eje-seguimiento.png',
    title: 'Seguimiento',
    desc: 'Resiliencia y cierre. La inteligencia de dar seguimiento.',
  },
];

export default function EjesSection() {
  return (
    <section className="ejes-section">
      <div className="container">
        <div className="ejes-header">
          <span className="tag-label">Anatomía de los canales digitales</span>
          <h2>
            3 ejes para diagnosticar <span>tu canal digital</span>
          </h2>
        </div>
        <div className="ejes-grid">
          {ejes.map((eje) => (
            <div key={eje.title} className="eje-card">
              <Image
                src={eje.icon}
                alt={eje.title}
                width={48}
                height={48}
                style={{ height: '48px', width: 'auto' }}
              />
              <div className="eje-card-title">{eje.title}</div>
              <div className="eje-card-desc">{eje.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
