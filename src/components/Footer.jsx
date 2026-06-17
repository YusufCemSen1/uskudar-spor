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
      </div>
    </footer>
  )
}
