import { Reveal, Stagger, StaggerItem } from './primitives';
import { Diya } from '../icons';
import { PUJAS, TRADITIONS } from '../data';

export default function Pujas() {
  return (
    <section className="section" id="pujas">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Most booked</span>
          <h2>Popular pujas</h2>
          <p>Trusted rituals families book again and again.</p>
        </Reveal>

        <Stagger className="grid-4">
          {PUJAS.map((p) => (
            <StaggerItem key={p.name} className="puja-card glass-frost" hover>
              <div className="puja-top">
                <span className="puja-tag">{p.tag}</span>
                <Diya width={40} height={40} style={{ color: 'rgba(122,31,43,0.3)' }} />
              </div>
              <div className="puja-b">
                <h3>{p.name}</h3>
                <div className="puja-m">{p.meta}</div>
                <div className="puja-f">
                  <span className="puja-price">{p.price}</span>
                  <span className="puja-go">Book →</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="trad-head"><span className="eyebrow">For every family</span></Reveal>
        <Stagger className="trads">
          {TRADITIONS.map((t) => (
            <StaggerItem key={t} className="trad glass" hover>
              <span className="trad-dot" /> {t}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
