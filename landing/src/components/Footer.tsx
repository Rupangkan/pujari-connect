import { Diya } from '../icons';

const COLS = [
  { h: 'Product', links: ['Features', 'How it works', 'Pujas', 'Download'] },
  { h: 'Company', links: ['About', 'Become a Pujari', 'Careers', 'Contact'] },
  { h: 'Support', links: ['Help Center', 'Terms of Service', 'Privacy Policy', 'Refund Policy'] },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="#top" className="brand">
              <span className="brand-mark"><Diya width={22} height={22} /></span>
              <span className="brand-text">Pujari<b>Connect</b></span>
            </a>
            <p className="footer-tag">Book trusted Pujaris for your rituals &amp; festivals — authentic, transparent, and across every tradition.</p>
          </div>
          {COLS.map((c) => (
            <div key={c.h} className="footer-col">
              <h4>{c.h}</h4>
              {c.links.map((l) => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Pujari Connect. All rights reserved.</span>
          <span>Made with devotion in India 🪔</span>
        </div>
      </div>
    </footer>
  );
}
