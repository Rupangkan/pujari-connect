import { Reveal, Stagger, StaggerItem } from './primitives';
import { STEPS } from '../data';

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Simple as 1-2-3</span>
          <h2>Your puja, booked in three steps</h2>
        </Reveal>

        <Stagger className="grid-3 steps">
          {STEPS.map((s) => (
            <StaggerItem key={s.n} className="step">
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
