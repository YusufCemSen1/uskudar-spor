import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚽ Üsküdar Anadolu SK</div>
            <p className="footer-sub">1985'ten bu yana Üsküdar'ın spor ailesi. Gençlere sporu sevdiriyor, şampiyonlar yetiştiriyoruz.</p>
          </div>
          <div>
            <div className="footer-col-title">SAYFALAR</div>
            <ul className="footer-links">
              <li><Link to="/haberler">Haberler</Link></li>
              <li><Link to="/branslar">Branşlar</Link></li>
              <li><Link to="/uyelik">Üyelik</Link></li>
              <li><Link to="/eticaret">E-Ticaret</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">İLETİŞİM</div>
            <ul className="footer-links">
              <li><a>📍 Üsküdar, İstanbul</a></li>
              <li><a>📞 0216 XXX XX XX</a></li>
              <li><a>✉ info@uskudaranadolu.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Üsküdar Anadolu Spor Kulübü. Tüm hakları saklıdır.
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.08)', fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
          Tasarım & Geliştirme{' '}
          <a href="https://yusufcemsen1.github.io/" target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,.6)', fontWeight: 700, textDecoration: 'none', transition: 'color .2s' }}
            onMouseOver={e => e.target.style.color = '#4ade80'}
            onMouseOut={e => e.target.style.color = 'rgba(255,255,255,.6)'}>
            Yusuf Cem Şen
          </a>
        </div>
      </div>
    </footer>
  )
}
