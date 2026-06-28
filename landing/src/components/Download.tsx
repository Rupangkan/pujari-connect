import { motion } from 'framer-motion';
import { Reveal, StoreButtons } from './primitives';
import { Diya } from '../icons';

export default function Download() {
  return (
    <section className="section" id="download">
      <div className="wrap">
        <Reveal>
          <div className="download-card glass">
            <motion.div
              className="download-diya"
              animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <Diya width={48} height={48} />
            </motion.div>
            <h2>Bring home a blessing today</h2>
            <p>Download Pujari Connect and book a trusted pandit for your next ritual in minutes.</p>
            <StoreButtons center />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
