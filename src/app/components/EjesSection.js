import Image from 'next/image';

const ejes = [
  {
    icon: '/images/icon-eje-orden.png',
    title: 'Orden',
    desc: 'Base operativa de tu canal digital.',
    ia: 'Sin proceso, la IA solo acelera la improvisación.',
  },
  {
    icon: '/images/icon-eje-foco.png',
    title: 'Foco',
    desc: 'Emoción y valor. La activación del inconsciente.',
    ia: 'La IA te ayuda con el mensaje; el sentido lo definís vos.',
  },
  {
    icon: '/images/icon-eje-seguimiento.png',
    title: 'Seguimiento',
    desc: 'Resiliencia y cierre. La inteligencia de dar seguimiento.',
    ia: 'Con método, la IA te ayuda a no soltar ninguna conversación.',
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
                width={68}
                height={68}
                style={{ height: '68px', width: '68px', objectFit: 'contain' }}
              />
              <div className="eje-card-title">{eje.title}</div>
              <div className="eje-card-desc">{eje.desc}</div>
              <div className="eje-card-ia">{eje.ia}</div>
            </div>
          ))}
        </div>
        <div className="ejes-ia">
          <p>
            La IA amplifica lo que ya existe. Si hay orden, lo multiplica. Si
            hay desorden, también.
          </p>
          <p>
            <strong>Primero tu método. Después, IA.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
