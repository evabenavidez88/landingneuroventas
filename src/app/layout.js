import './globals.css';

export const metadata = {
  title: 'Checklist Neuroventa Digital – Recurso Gratuito | Eva Benavidez',
  description: '15 preguntas para saber exactamente qué ajustar en tu canal digital y vender más sin improvisar.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
