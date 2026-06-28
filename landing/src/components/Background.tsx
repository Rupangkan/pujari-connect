import { motion } from 'framer-motion';

const orbs = [
  { c: 'rgba(255,122,26,0.55)', size: 520, top: '-8%', left: '-6%', dur: 18, x: 60, y: 40 },
  { c: 'rgba(255,178,62,0.45)', size: 440, top: '20%', left: '70%', dur: 22, x: -70, y: 60 },
  { c: 'rgba(122,31,43,0.6)', size: 560, top: '55%', left: '-10%', dur: 26, x: 80, y: -50 },
  { c: 'rgba(230,199,126,0.4)', size: 400, top: '68%', left: '62%', dur: 20, x: -50, y: -60 },
];

export default function Background() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', background: 'linear-gradient(160deg, #3A0E18 0%, #6A1A28 38%, #9A3A14 70%, #C25A12 100%)' }}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', top: o.top, left: o.left,
            width: o.size, height: o.size, borderRadius: '50%',
            background: `radial-gradient(circle, ${o.c}, transparent 68%)`,
            filter: 'blur(50px)',
          }}
          animate={{ x: [0, o.x, 0], y: [0, o.y, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* subtle top sheen + bottom fade for depth */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 60% at 50% -10%, rgba(255,247,234,0.12), transparent 60%)' }} />
    </div>
  );
}
