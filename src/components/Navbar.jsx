import React, { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'

const NAV_LINKS = [
  { to: '/',         label: 'Anasayfa' },
  { to: '/haberler', label: 'Haberler' },
  { to: '/branslar', label: 'Branşlar' },
  { to: '/fikstür',  label: 'Fikstür' },
  { to: '/uyelik',   label: 'Üyelik' },
  { to: '/magaza',   label: 'Mağaza' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/iletisim',   label: 'İletişim' },
]

function LogoImg({ size = 42, round = true }) {
  const { settings, effectiveLogo } = useSite()
  const [err, setErr] = useState(false)

  if (err || !effectiveLogo) {
    return <div className="navbar-brand-icon">⚽</div>
  }

  return (
    <img
      src={effectiveLogo}
      alt="logo"
      onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: round ? '50%' : 8, objectFit: 'cover', border: '2px solid rgba(255,255,255,.3)' }}
    />
  )
}

export { LogoImg }

export default function Navbar() {
  const { cartCount } = useShop()
  const { currentUser, logout, isAdmin } = useAuth()
  const { settings } = useSite()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dropRef = useRef()

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); setProfileOpen(false); navigate('/') }

  return (
    <>
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-left">
          <span>📍 Üsküdar, İstanbul</span>
        </div>
        <div className="topbar-right">
          {currentUser ? (
            <div style={{ position: 'relative' }} ref={dropRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontWeight: 600 }}>
                <div style={{ width: 22, height: 22, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                  {currentUser.avatar || currentUser.name?.slice(0,2).toUpperCase()}
                </div>
                {currentUser.name?.split(' ')[0]}
                <span style={{ fontSize: 10 }}>▾</span>
              </button>
              {profileOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,.15)', minWidth: 180, zIndex: 500, overflow: 'hidden', animation: 'scaleIn .15s ease' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{currentUser.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  </div>
                  {[
                    { label: '👤 Profilim', to: '/profil' },
                    { label: '📦 Siparişlerim', to: '/profil?tab=orders' },
                    { label: '❤️ Favorilerim', to: '/profil?tab=favs' },
                  ].map(item => (
                    <div key={item.to} onClick={() => { navigate(item.to); setProfileOpen(false) }}
                      style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--text)', transition: 'background .15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--green-pale)'}
                      onMouseOut={e => e.currentTarget.style.background = ''}>
                      {item.label}
                    </div>
                  ))}
                  {isAdmin && (
                    <div onClick={() => { navigate('/panel'); setProfileOpen(false) }}
                      style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--green-dark)', fontWeight: 700, borderTop: '1px solid #f0f0f0', transition: 'background .15s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--green-pale)'}
                      onMouseOut={e => e.currentTarget.style.background = ''}>
                      ⚙️ Yönetim Paneli
                    </div>
                  )}
                  <div onClick={handleLogout}
                    style={{ padding: '10px 16px', fontSize: 13, cursor: 'pointer', color: '#e53935', borderTop: '1px solid #f0f0f0', transition: 'background .15s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fff5f5'}
                    onMouseOut={e => e.currentTarget.style.background = ''}>
                    🚪 Çıkış Yap
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/giris" style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Giriş Yap</Link>
              <div className="topbar-divider" />
              <Link to="/kayit" style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Üye Ol</Link>
            </>
          )}
        </div>
      </div>

      {/* Main nav */}
      <nav className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            <LogoImg size={44} />
            <div>
              <div className="navbar-brand-text-main">{settings.clubShort}</div>
              <div className="navbar-brand-text-sub">{settings.clubSub}</div>
            </div>
          </NavLink>

          <div className="navbar-links">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/sepet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'rgba(255,255,255,.06)', borderRadius: 10, border: '1px solid var(--dark-border)', color: '#fff', textDecoration: 'none', position: 'relative', fontSize: 18, transition: 'background .2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--green)', color: '#fff', width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cartCount}
                </span>
              )}
            </Link>
            {!currentUser && (
              <Link to="/kayit" className="btn btn-primary btn-sm navbar-cta-desktop" style={{ textDecoration: 'none', borderRadius: 8 }}>
                Üye Ol
              </Link>
            )}
            {/* Hamburger - sadece mobil */}
            <button className="hamburger-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menü">
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
              <span className={`ham-line${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobil menü overlay */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--green-dark)' }}>{settings.clubShort}</div>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#333' }}>✕</button>
            </div>
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' active' : '')}
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #eee', display: 'flex', gap: 10 }}>
              {currentUser ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{ flex: 1, padding: '10px', background: '#fee', border: '1px solid #fcc', borderRadius: 8, color: '#e53935', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>🚪 Çıkış Yap</button>
              ) : (
                <>
                  <Link to="/giris" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: 8, color: '#333', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontSize: 14 }}>Giriş Yap</Link>
                  <Link to="/kayit" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '10px', background: 'var(--green)', borderRadius: 8, color: '#fff', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontSize: 14 }}>Üye Ol</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
