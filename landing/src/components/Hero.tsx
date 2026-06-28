import { motion } from 'framer-motion';
import PhoneMockup from './PhoneMockup';
import { StoreButtons } from './primitives';
import { ArrowDown } from '../icons';

const ease = [0.22, 1, 0.36, 1] as const;
const up = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" {...up(0.05)}>Sacred rituals, simplified</motion.span>
          <motion.h1 className="hero-title" {...up(0.12)}>
            Book trusted <span className="grad-text">Pujaris</span> for every ritual &amp; festival
          </motion.h1>
          <motion.p className="hero-lead" {...up(0.2)}>
            Verified pandits for home, temple, and online pujas — across every tradition.
            Transparent pricing, authentic rituals, booked in minutes.
          </motion.p>

          <motion.div className="hero-actions" {...up(0.28)}>
            <a href="#download" className="btn btn-primary btn-lg"><ArrowDown /> Download the App</a>
            <a href="#pujas" className="btn btn-glass btn-lg">Explore Pujas</a>
          </motion.div>

          <motion.div className="hero-store" {...up(0.36)}>
            <StoreButtons />
          </motion.div>

          <motion.div className="hero-trust" {...up(0.44)}>
            <div className="avatars" aria-hidden>
              <span style={{ background: '#FF7A1A' }}>R</span>
              <span style={{ background: '#7A1F2B' }}>S</span>
              <span style={{ background: '#C99A3E' }}>A</span>
              <span style={{ background: '#2E9E5B' }}>P</span>
            </div>
            <div>
              <div className="stars" aria-hidden>★★★★★</div>
              <div className="trust-text"><b>4.9/5</b> from 2,000+ devotees</div>
            </div>
          </motion.div>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
