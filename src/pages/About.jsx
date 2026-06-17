import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { useIsMobile } from '../hooks/useIsMobile'

export default function About() {
  const navigate = useNavigate()
  const { settings } = useSite()
  const about = settings.about || {}
  const milestones = about.milestones || []
  const values = about.values || []
  const board = about.board || []
  const isMobile = useIsMobile()

  return (
    <div>
      <div className="page-header" style={{ minHeight: 280 }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,.7)', letterSpacing: 3, marginBottom: 8 }} className="anim-trackIn">KULÜBܒMÜZ</div>
          <h1 className="anim-trackIn delay-1">🏛️ Hakkımızda</h1>
          <p className="anim-trackIn delay-2">1908'ten bu yana Üsküdar'ın spor ailesi</p>
        </div>
      </div>

      <div className="page-wrap">

        {/* Misyon & Vizyon */}
        {(about.mission || about.vision) && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 48 }}>
            {[
              { label: 'MİSYONUMUZ', icon: '🎯', text: about.mission },
              { label: 'VİZYONUMUZ',  icon: '🔭', text: about.vision },
            ].filter(x => x.text).map(({ label, icon, text }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '28px 28px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,.05)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: 'var(--green)', marginBottom: 10, textTransform: 'uppercase' }}>{label}</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text-muted)', margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tarihçe */}
        {milestones.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 32, textAlign: 'center' }}>📅 Tarihçemiz</h2>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'var(--green-pale)', transform: 'translateX(-50%)' }} />
              {milestones.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end', marginBottom: 32, position: 'relative' }}>
                  <div style={{ width: '44%', background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(0,0,0,.06)', position: 'relative' }}>
                    <div style={{ position: 'absolute', [i % 2 === 0 ? 'right' : 'left']: -22, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, background: 'var(--green)', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 0 0 2px var(--green)' }} />
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green)', marginBottom: 4 }}>{m.year}</div>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{m.title}</div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Değerlerimiz */}
        {values.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 28, textAlign: 'center' }}>💡 Değerlerimiz</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
              {values.map((v, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '24px 20px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.05)', transition: 'transform .2s, box-shadow .2s' }}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,145,58,.12)' }}
                  onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.05)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{v.icon}</div>
                  <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 8 }}>{v.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Yönetim Kurulu */}
        {board.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 28, textAlign: 'center' }}>👔 Yönetim Kurulu</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20 }}>
              {board.map((b, i) => (
                <Link key={i} to={`/biyografi/yonetim/${i}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,.05)', transition: 'transform .2s, box-shadow .2s' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,145,58,.15)' }}
                    onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.05)' }}>
                    <div style={{ height: 160, background: 'linear-gradient(135deg,var(--green-dark),var(--green))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                      {b.image
                        ? <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                        : <span style={{ fontSize: 48 }}>{b.icon || '👤'}</span>
                      }
                    </div>
                    <div style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 4 }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 700, marginBottom: 6 }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Özgeçmiş →</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* İstatistikler */}
        {(settings.stats?.length > 0) && (
          <section style={{ marginBottom: 56 }}>
            <div className="animated-bg" style={{ borderRadius: 20, padding: '48px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 32, textAlign: 'center' }}>
              {settings.stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: '#fff', lineHeight: 1 }}>{s.value}{s.suffix}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,.65)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 8, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 8px', fontWeight: 900 }}>Kulübümüze Katılın</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>Üyelik başvurusu yapın veya bizimle iletişime geçin.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary btn-ripple" onClick={() => navigate('/uyelik')}>Üye Ol →</button>
            <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => navigate('/iletisim')}>İletişim</button>
          </div>
        </div>
      </div>
    </div>
  )
}
