import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Diya, Menu, Close } from '../icons';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#pujas', label: 'Pujas' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="nav-bar">
      <div className="wrap">
        <motion.div
          className={`nav-island glass ${scrolled ? 'scrolled' : ''}`}
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* liquid-glass sheen sweep */}
          <motion.span
            className="nav-sheen"
            aria-hidden
            animate={{ x: ['-130%', '230%'] }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          />

          <a href="#top" className="brand nav-z" aria-label="Pujari Connect home">
            <span className="brand-mark"><Diya width={20} height={20} /></span>
            <span className="brand-text">Pujari<b>Connect</b></span>
          </a>

          <nav className="nav-links nav-z" aria-label="Primary">
            {LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>

          <div className="nav-cta nav-z">
            <a href="#download" className="btn btn-primary nav-get">Get the App</a>
            <button className="nav-burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="wrap nav-mobile-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            <div className="nav-mobile glass">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              ))}
              <a href="#download" className="btn btn-primary" onClick={() => setOpen(false)}>Get the App</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
