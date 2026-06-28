import { Reveal, Stagger, StaggerItem } from './primitives';
import { TESTIMONIALS } from '../data';

export default function Testimonials() {
  return (
    <section className="section" id="reviews">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow">Loved by devotees</span>
          <h2>What families say</h2>
        </Reveal>

        <Stagger className="grid-3">
          {TESTIMONIALS.map((t) => (
            <StaggerItem key={t.name} className="testimonial glass-frost" hover>
              <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                {'★★★★★'.slice(0, t.rating)}{'☆☆☆☆☆'.slice(0, 5 - t.rating)}
              </div>
              <p className="testimonial-text">“{t.text}”</p>
              <div className="testimonial-who">
                <span className="testimonial-av" style={{ background: t.color }}>{t.name.charAt(0)}</span>
                <div><b>{t.name}</b><small>{t.city}</small></div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
