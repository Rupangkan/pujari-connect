import { motion } from 'framer-motion';
import { Diya, Search, Check, Rupee, Star, Pin, Home, Person, Basket } from '../icons';

export default function PhoneMockup() {
  return (
    <div className="phone-stage">
      {/* floating glass chips */}
      <motion.div
        className="float-chip glass chip-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
        transition={{ opacity: { delay: 0.8, duration: 0.5 }, x: { delay: 0.8, duration: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
      >
        <span className="chip-ic" style={{ background: 'rgba(22,163,74,0.18)', color: '#1fbf6b' }}><Check width={16} height={16} /></span>
        <div><b>Verified pandit</b><small>Identity checked</small></div>
      </motion.div>

      <motion.div
        className="float-chip glass chip-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 9, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.5 }, x: { delay: 1, duration: 0.5 }, y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
      >
        <span className="chip-ic" style={{ background: 'rgba(255,122,26,0.2)', color: '#ff7a1a' }}><Rupee width={16} height={16} /></span>
        <div><b>Transparent price</b><small>No hidden charges</small></div>
      </motion.div>

      <motion.div
        className="phone"
        initial={{ opacity: 0, y: 40, rotate: -2 }}
        animate={{ opacity: 1, y: [0, -12, 0], rotate: 0 }}
        transition={{ opacity: { duration: 0.7, delay: 0.3 }, rotate: { duration: 0.7, delay: 0.3 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 } }}
      >
        {/* hardware */}
        <span className="phone-btn phone-btn-power" aria-hidden />
        <span className="phone-btn phone-btn-vol-up" aria-hidden />
        <span className="phone-btn phone-btn-vol-dn" aria-hidden />

        <div className="phone-screen">
          {/* status bar */}
          <div className="scr-status">
            <span className="scr-time">9:41</span>
            <span className="scr-island" />
            <span className="scr-sys">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1" opacity=".4"/></svg>
              <svg width="22" height="11" viewBox="0 0 24 12" fill="none"><rect x="1" y="1" width="19" height="10" rx="2.5" stroke="currentColor" stroke-width="1.2" opacity=".5"/><rect x="2.5" y="2.5" width="14" height="7" rx="1.2" fill="currentColor"/><rect x="21" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".5"/></svg>
            </span>
          </div>

          {/* header */}
          <div className="scr-head">
            <div className="scr-loc">
              <span className="scr-loc-pin"><Pin width={14} height={14} /></span>
              <div>
                <div className="scr-loc-label">DELIVER TO</div>
                <div className="scr-loc-city">Guwahati, Assam</div>
              </div>
            </div>
            <div className="scr-avatar">B</div>
          </div>

          {/* search */}
          <div className="scr-search"><Search width={15} height={15} /> Search pujas, pujaris…</div>

          {/* featured */}
          <div className="scr-label">Popular Pujas</div>
          <div className="scr-card">
            <div className="scr-banner">
              <span className="scr-badge">Most Popular</span>
              <span className="scr-rating"><Star width={11} height={11} /> 4.9</span>
              <Diya width={38} height={38} style={{ color: 'rgba(122,31,43,0.34)' }} />
            </div>
            <div className="scr-body">
              <div className="scr-title">Griha Pravesh Puja</div>
              <div className="scr-meta">
                <span><Pin width={11} height={11} /> At Your Home</span>
                <span>· 2 hrs</span>
              </div>
              <div className="scr-foot">
                <div>
                  <div className="scr-from">From</div>
                  <div className="scr-price">₹5,100</div>
                </div>
                <span className="scr-book">Book Now</span>
              </div>
            </div>
          </div>

          {/* chips */}
          <div className="scr-pills">
            <span className="scr-pill on">All</span>
            <span className="scr-pill">Home</span>
            <span className="scr-pill">Temple</span>
            <span className="scr-pill">Festival</span>
          </div>

          {/* bottom tab bar */}
          <div className="scr-tabs">
            <span className="scr-tab on"><Home width={20} height={20} /><i>Home</i></span>
            <span className="scr-tab"><Person width={20} height={20} /><i>Pujari</i></span>
            <span className="scr-tab"><Diya width={20} height={20} /><i>Puja</i></span>
            <span className="scr-tab"><Basket width={20} height={20} /><i>Cart</i></span>
          </div>
        </div>

        {/* glass reflection */}
        <span className="phone-glare" aria-hidden />
      </motion.div>
    </div>
  );
}
