import Topbar from './components/Topbar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EjesSection from './components/EjesSection';
import PresentacionEva from './components/PresentacionEva';
import Cierre from './components/Cierre';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Topbar />
      <Navbar />
      <Hero />
      <EjesSection />
      <PresentacionEva />
      <Cierre />
      <Footer />
    </>
  );
}
