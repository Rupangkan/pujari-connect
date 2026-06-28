import { Reveal, Stagger, StaggerItem, CountUp } from './primitives';
import { STATS } from '../data';

export default function Stats() {
  return (
    <section className="section stats-section">
      <div className="wrap">
        <Reveal>
          <Stagger className="stats-panel glass-frost">
            {STATS.map((s) => (
              <StaggerItem key={s.label} className="stat">
                <div className="stat-n"><CountUp value={s.value} suffix={s.suffix} /></div>
                <div className="stat-l">{s.label}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  );
}
