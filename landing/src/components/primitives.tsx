import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Apple, Play } from '../icons';

/* ── Scroll reveal (fade + rise) ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Staggered group ── */
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

export function Stagger({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div className={className} style={style} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, style, hover = false }: { children: ReactNode; className?: string; style?: React.CSSProperties; hover?: boolean }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={fadeUp}
      whileHover={hover ? { y: -6, transition: { duration: 0.2 } } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* ── Count-up number (animates when scrolled into view) ── */
export function CountUp({ value, suffix = '', duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');
  const isFloat = !Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = value * eased;
      setDisplay(isFloat ? current.toFixed(1) : Math.round(current).toLocaleString('en-IN'));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, isFloat]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── App Store / Play Store buttons ── */
export function StoreButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={`store-row ${center ? 'center' : ''}`}>
      <motion.a
        href="#" aria-label="Download on the App Store" className="store glass"
        whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
      >
        <Apple width={26} height={26} />
        <span><small>Download on the</small><b>App Store</b></span>
      </motion.a>
      <motion.a
        href="#" aria-label="Get it on Google Play" className="store glass"
        whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
      >
        <Play width={26} height={26} />
        <span><small>Get it on</small><b>Google Play</b></span>
      </motion.a>
    </div>
  );
}
