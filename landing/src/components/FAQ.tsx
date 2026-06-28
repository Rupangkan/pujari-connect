import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from './primitives';
import { Chevron } from '../icons';
import { FAQS } from '../data';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section" id="faq">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Good to know</span>
          <h2>Frequently asked questions</h2>
        </Reveal>

        <div className="faq">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className="qa glass-frost">
                  <button className="qa-q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                    <span>{f.q}</span>
                    <motion.span className="qa-chev" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <Chevron width={20} height={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="qa-a-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="qa-a">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
