import './components/components.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pujas from './components/Pujas';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Download from './components/Download';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Pujas />
        <Testimonials />
        <FAQ />
        <Download />
      </main>
      <Footer />
    </>
  );
}
