import { Reveal, Stagger, StaggerItem } from './primitives';
import { FEATURES } from '../data';

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Why Pujari Connect</span>
          <h2>Everything you need for an authentic puja</h2>
          <p>From booking a trusted pandit to choosing the right package — all in one calm, simple place.</p>
        </Reveal>

        <Stagger className="grid-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title} className="feature glass-frost" hover>
              <span className="feature-ic"><f.icon width={26} height={26} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
