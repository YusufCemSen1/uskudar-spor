import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useSite } from '../context/SiteContext'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'

const SOCIAL_ICONS = {
  Instagram: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.82.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227a3.7 3.7 0 0 1-.896 1.382 3.7 3.7 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413a3.7 3.7 0 0 1-1.381-.896 3.7 3.7 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227a3.7 3.7 0 0 1 .896-1.381A3.7 3.7 0 0 1 4.923 2.648c.422-.164 1.057-.36 2.227-.413C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.902.333 4.14.63a5.86 5.86 0 0 0-2.126 1.384A5.86 5.86 0 0 0 .63 4.14C.333 4.902.131 5.775.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.059 1.277.261 2.15.558 2.912a5.86 5.86 0 0 0 1.384 2.126 5.86 5.86 0 0 0 2.126 1.384c.763.297 1.635.499 2.912.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.059 2.15-.261 2.912-.558a5.86 5.86 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.297-.763.499-1.635.558-2.912C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.059-1.277-.261-2.15-.558-2.912a5.86 5.86 0 0 0-1.384-2.126A5.86 5.86 0 0 0 19.86.63C19.098.333 18.225.131 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  Twitter:   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>,
  Facebook:  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.234 2.686.234v2.97h-1.514c-1.491 0-1.956.928-1.956 1.879v2.258h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z"/></svg>,
  YouTube:   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
}

const BRANCHES = [
  { icon: '⚽', name: 'Futbol',      color: '#00913A', sub: 'Erkek & Kadın & Altyapı' },
  { icon: '🏀', name: 'Basketbol',   color: '#006B2B', sub: 'Erkek & Kadın' },
  { icon: '🏐', name: 'Voleybol',       color: '#00B548', sub: 'Her Yaş Grubu' },
  { icon: '🏓', name: 'Masa Tenisi', color: '#004d20', sub: 'Bireysel & Takım' },
]

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0)
  const started = useRef(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = target / (duration / 16)
        const t = setInterval(() => {
          start = Math.min(start + step, target)
          setVal(Math.floor(start))
          if (start >= target) clearInterval(t)
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return [val, ref]
}

function StatCard({ stat, delay }) {
  const [val, ref] = useCountUp(stat.value)
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '36px 20px', borderRight: '1px solid var(--dark-border)', animationDelay: `${delay}s` }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,6vw,72px)', lineHeight: 1,
        background: 'linear-gradient(135deg, #fff 30%, rgba(0,212,85,.8) 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10 }}>
        {val}{stat.suffix}
      </div>
      <div style={{ fontSize: 12, color: 'var(--dark-muted)', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</div>
    </div>
  )
}

export default function Home() {
  const { news, contact, fixtures } = useStore()
  const { settings, effectiveLogo } = useSite()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const [leavingSlide, setLeavingSlide] = useState(null)
  const [logoError, setLogoError] = useState(false)

  const goToSlide = (next) => {
    setLeavingSlide(slide)
    setSlide(next)
    setTimeout(() => setLeavingSlide(null), 800)
  }

  const published = news.filter(n => n.published)
  const latest = published.slice(0, 5)

  // Hero slider: en yeni haberlerden oluştur, yoksa varsayılan slaytları kullan
  const heroSlides = latest.length > 0
    ? latest.slice(0, 5).map(n => ({
        tag: n.category,
        title: n.title,
        sub: n.content?.slice(0, 110) + (n.content?.length > 110 ? '...' : ''),
        btn: 'Haberi Oku',
        image: n.images?.[0] || n.image || null,
      }))
    : settings.slides

  useEffect(() => {
    const t = setInterval(() => {
      const next = (slide + 1) % heroSlides.length
      goToSlide(next)
    }, 5000)
    return () => clearInterval(t)
  }, [slide, heroSlides.length])

  return (
    <div>
      {/* ── HERO SLIDER ─────────────────────────────── */}
      <div className="hero-slider" style={{ position: 'relative', overflow: 'hidden' }}>
        {heroSlides.map((s, i) => (
          <div key={i} className={`hero-slide${slide === i ? ' active' : leavingSlide === i ? ' leaving' : ''}`}>
            {/* Animasyonlu / görselli arka plan */}
            {s.image ? (
              <>
                <div className="hero-slide-bg floodlight-sweep" style={{ backgroundImage: `url(${s.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(100deg, rgba(0,40,15,.78) 0%, rgba(0,77,26,.45) 45%, rgba(0,0,0,.15) 100%)' }} />
              </>
            ) : (
              <div className="hero-slide-bg animated-bg floodlight-sweep" />
            )}
            {/* Parçacık daireleri */}
            <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
              {[...Array(6)].map((_,j) => (
                <div key={j} style={{
                  position:'absolute', borderRadius:'50%',
                  background:'rgba(255,255,255,.04)',
                  width: [200,300,150,250,180,220][j],
                  height: [200,300,150,250,180,220][j],
                  top: ['10%','-10%','60%','30%','70%','5%'][j],
                  left: ['5%','60%','75%','20%','45%','80%'][j],
                  animation: `float ${[4,6,5,7,4.5,6.5][j]}s ease-in-out infinite`,
                  animationDelay: `${j * .8}s`
                }} />
              ))}
            </div>
            {/* Logo - Fenerbahçe tarzı sağda büyük */}
            {!logoError && effectiveLogo && (
              <img src={effectiveLogo} alt="" onError={() => setLogoError(true)}
                style={{ position:'absolute', right:'6%', top:'50%', transform:'translateY(-50%)',
                  width:'clamp(200px,25vw,340px)', height:'clamp(200px,25vw,340px)',
                  objectFit:'contain', opacity:.15, pointerEvents:'none',
                  filter:'brightness(0) invert(1)',
                  animation:'spin-slow 30s linear infinite' }} />
            )}
            {!s.image && <div className="hero-slide-overlay" />}
            <div className="hero-slide-content" style={{ position:'relative', zIndex:2 }}>
              <div className="hero-slide-tag">{s.tag}</div>
              <h1 className="hero-slide-title" style={{ whiteSpace:'pre-line' }}>{s.title}</h1>
              <p className="hero-slide-sub">{s.sub}</p>
              <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
                <button className="btn btn-primary btn-ripple" style={{ fontSize:15, padding:'14px 32px', borderRadius:12 }}
                  onClick={() => navigate('/haberler')}>{s.btn} →</button>
                {!currentUser && (
                  <button className="btn btn-outline" style={{ fontSize:15, padding:'14px 28px', borderRadius:12 }}
                    onClick={() => navigate('/kayit')}>Üye Ol</button>
                )}
              </div>
              {/* Floating stats chips */}
              <div style={{ display:'flex', gap:20, marginTop:52, flexWrap:'wrap' }}>
                {[['500+','Aktif Üye'],['4','Branş'],['1908','Kuruluş']].map(([n,l]) => (
                  <div key={l} style={{ display:'flex', flexDirection:'column', gap:2 }}>
                    <span style={{ fontFamily:'var(--font-display)', fontSize:28, color:'#fff', lineHeight:1 }}>{n}</span>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,.45)', letterSpacing:1.5, textTransform:'uppercase', fontWeight:600 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="hero-arrows">
          <button className="hero-arrow" onClick={() => goToSlide((slide - 1 + heroSlides.length) % heroSlides.length)}>‹</button>
          <button className="hero-arrow" onClick={() => goToSlide((slide + 1) % heroSlides.length)}>›</button>
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => <button key={i} className={`hero-dot${slide === i ? ' active' : ''}`} onClick={() => goToSlide(i)} />)}
        </div>
      </div>

      {/* ── BRANŞ ŞERİDİ ─────────────────────────────── */}
      <div style={{ background:'var(--dark-2)', borderTop:'1px solid var(--dark-border)', borderBottom:'1px solid var(--dark-border)' }}>
        <div className="home-branches-grid" style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {BRANCHES.map((b, i) => (
            <Reveal key={b.name} direction="up" delay={i * 0.08} style={{ borderRight: i < BRANCHES.length-1 ? '1px solid var(--dark-border)' : 'none' }}>
              <div onClick={() => navigate('/branslar')} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'40px 20px', cursor:'pointer', transition:'background .2s, transform .3s' }}
                onMouseOver={e => { e.currentTarget.style.background='rgba(0,168,68,.07)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseOut={e => { e.currentTarget.style.background=''; e.currentTarget.style.transform='' }}>
                <span style={{ fontSize:38, marginBottom:14, display:'block' }}>{b.icon}</span>
                <div style={{ fontFamily:'var(--font-display)', color:'#fff', fontSize:22, letterSpacing:1, marginBottom:6 }}>{b.name.toUpperCase()}</div>
                <div style={{ color:'var(--dark-muted)', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', fontWeight:600 }}>{b.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── STAT BARI ─────────────────────────────── */}
      <div style={{ background:'var(--dark)', borderTop:'1px solid var(--dark-border)' }}>
        <div className="home-stats-grid" style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
          {settings.stats.map((s, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1}>
              <StatCard stat={s} delay={i * .1} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── HABERLER ─────────────────────────────── */}
      <div style={{ background:'#fff', padding:'96px 16px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal direction="up">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>KULÜP HABERLERİ</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,58px)', lineHeight:.95, color:'var(--text)', letterSpacing:.5, margin:0 }}>SON HABERLER</h2>
            </div>
            <Link to="/haberler" style={{ color:'var(--green)', fontWeight:700, fontSize:14, textDecoration:'none', display:'flex', alignItems:'center', gap:6, padding:'10px 20px', border:'1.5px solid var(--green)', borderRadius:10, transition:'all .2s' }}
              onMouseOver={e => { e.currentTarget.style.background='var(--green)'; e.currentTarget.style.color='#fff' }}
              onMouseOut={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='var(--green)' }}>
              Tümünü Gör →
            </Link>
          </div>
          </Reveal>

          <div className="home-news-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
            {/* Büyük ana haber */}
            {latest[0] && (
              <Reveal direction="left" style={{ gridRow:'span 2' }}>
              <div className="news-card card-tilt card-shine" onClick={() => navigate('/haberler')}
                style={{ borderRadius:14, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer', height:'100%', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}>
                <div style={{ height:260, overflow:'hidden', position:'relative', background:'linear-gradient(135deg,var(--green-dark),var(--green))' }}>
                  {(latest[0].images?.[0] || latest[0].image)
                    ? <img src={latest[0].images?.[0] || latest[0].image} alt={latest[0].title}
                        style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s ease' }}
                        onMouseOver={e => e.target.style.transform='scale(1.06)'}
                        onMouseOut={e => e.target.style.transform='scale(1)'} />
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, position:'relative' }}>
                        <span style={{ animation:'float 3s ease-in-out infinite' }}>{latest[0].icon}</span>
                        {effectiveLogo && !logoError && <img src={effectiveLogo} onError={() => setLogoError(true)} alt="" style={{ position:'absolute', right:20, bottom:10, width:60, height:60, objectFit:'contain', opacity:.12 }} />}
                      </div>
                  }
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(transparent,rgba(0,0,0,.5))' }} />
                  <span style={{ position:'absolute', top:12, left:12, background:'var(--green)', color:'#fff', fontSize:11, fontWeight:800, padding:'4px 10px', borderRadius:20, letterSpacing:.5 }}>{latest[0].category}</span>
                </div>
                <div style={{ padding:20 }}>
                  <div style={{ fontSize:18, fontWeight:800, lineHeight:1.35, marginBottom:10, color:'var(--text)' }}>{latest[0].title}</div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7 }}>{latest[0].content?.slice(0,130)}...</div>
                  <div style={{ marginTop:14, fontSize:12, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:6 }}>
                    <span>📅</span>{latest[0].date}
                  </div>
                </div>
              </div>
              </Reveal>
            )}

            {/* Küçük haberler */}
            <div style={{ display:'grid', gridTemplateRows:'repeat(2,1fr)', gap:16 }}>
              {latest.slice(1,3).map((n, i) => {
                const thumb = n.images?.[0] || n.image
                return (
                  <Reveal key={n.id} direction="right" delay={i * 0.14}>
                  <div className="news-card card-shine" onClick={() => navigate('/haberler')}
                    style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer', display:'flex', background:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,.05)', transition:'transform .3s ease, box-shadow .3s ease' }}
                    onMouseOver={e => { e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(0,0,0,.1)' }}
                    onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    <div style={{ width:110, flexShrink:0, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                      {thumb
                        ? <img src={thumb} alt={n.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : <span style={{ fontSize:32 }}>{n.icon}</span>
                      }
                    </div>
                    <div style={{ padding:'14px 16px', flex:1, minWidth:0 }}>
                      <span style={{ background:'var(--green-pale)', color:'var(--green-dark)', fontSize:10, fontWeight:800, padding:'3px 8px', borderRadius:10, letterSpacing:.5 }}>{n.category}</span>
                      <div style={{ fontWeight:700, fontSize:14, marginTop:6, lineHeight:1.35, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{n.title}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:6 }}>{n.date}</div>
                    </div>
                  </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          {/* Alt haber sırası */}
          {latest.length > 3 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16, marginTop:20 }}>
              {latest.slice(3).map((n, i) => {
                const thumb = n.images?.[0] || n.image
                return (
                  <Reveal key={n.id} direction="up" delay={i * 0.1}>
                  <div className="news-card card-shine" onClick={() => navigate('/haberler')}
                    style={{ borderRadius:12, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer', background:'#fff', transition:'transform .3s ease, box-shadow .3s ease' }}
                    onMouseOver={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(0,0,0,.11)' }}
                    onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}>
                    <div style={{ height:120, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                      {thumb ? <img src={thumb} alt={n.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span style={{ fontSize:40 }}>{n.icon}</span>}
                    </div>
                    <div style={{ padding:'12px 14px' }}>
                      <span style={{ background:'var(--green-pale)', color:'var(--green-dark)', fontSize:10, fontWeight:800, padding:'2px 7px', borderRadius:10 }}>{n.category}</span>
                      <div style={{ fontWeight:700, fontSize:13, marginTop:6, lineHeight:1.3 }}>{n.title}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:5 }}>{n.date}</div>
                    </div>
                  </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── YAKLAŞAN MAÇLAR ─────────────────────────────── */}
      {fixtures?.filter(f => f.status === 'upcoming').length > 0 && (() => {
        const upcoming = fixtures.filter(f => f.status === 'upcoming').sort((a,b) => new Date(a.date)-new Date(b.date)).slice(0,4)
        const BRANCH_COLOR = { Futbol:'#00913A', Basketbol:'#006B2B', Voleybol:'#00B548', 'Masa Tenisi':'#004d20' }
        const BRANCH_ICON  = { Futbol:'⚽', Basketbol:'🏀', Voleybol:'🏐', 'Masa Tenisi':'🏓' }
        return (
          <div style={{ padding:'80px 16px', background:'#fff' }}>
            <div style={{ maxWidth:1100, margin:'0 auto' }}>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:800, color:'var(--green)', letterSpacing:3, textTransform:'uppercase', marginBottom:10 }}>MAÇLAR</div>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,44px)', lineHeight:.95, margin:0 }}>YAKLAŞAN MAÇLAR</h2>
                </div>
                <Link to="/fikstür" style={{ color:'var(--green)', fontWeight:700, fontSize:14, textDecoration:'none', display:'flex', alignItems:'center', gap:6, padding:'10px 20px', border:'1.5px solid var(--green)', borderRadius:10 }}>Tüm Fikstür →</Link>
              </div>
              <div style={{ display:'grid', gap:12 }}>
                {upcoming.map(f => {
                  const color = BRANCH_COLOR[f.branch] || '#00913A'
                  const icon  = BRANCH_ICON[f.branch] || '🏅'
                  const isHome = f.homeTeam?.includes('Üsküdar')
                  const dateStr = f.date ? new Date(f.date+'T00:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'short'}) : ''
                  return (
                    <div key={f.id} style={{ background:'var(--gray-bg)', borderRadius:14, border:'1px solid var(--border)', display:'grid', gridTemplateColumns:'4px 1fr', overflow:'hidden' }}>
                      <div style={{ background:color }} />
                      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                        <div style={{ minWidth:110, flexShrink:0 }}>
                          <div style={{ fontSize:11, color, fontWeight:800, marginBottom:3 }}>{icon} {f.branch}</div>
                          <div style={{ fontWeight:800, fontSize:14 }}>{dateStr}</div>
                          {f.time && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>⏰ {f.time}</div>}
                        </div>
                        <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                          <div style={{ textAlign:'right', flex:1, minWidth:100 }}>
                            <div style={{ fontWeight: isHome?900:700, fontSize:15, color: isHome?color:'var(--text)' }}>{f.homeTeam}</div>
                            {isHome && <div style={{ fontSize:10, color, fontWeight:700, marginTop:2 }}>EV SAHİBİ</div>}
                          </div>
                          <div style={{ background:color, color:'#fff', borderRadius:8, padding:'6px 14px', fontFamily:'var(--font-display)', fontSize:16, fontWeight:900, flexShrink:0 }}>VS</div>
                          <div style={{ textAlign:'left', flex:1, minWidth:100 }}>
                            <div style={{ fontWeight:!isHome?900:700, fontSize:15, color:!isHome?color:'var(--text)' }}>{f.awayTeam}</div>
                            {!isHome && <div style={{ fontSize:10, color, fontWeight:700, marginTop:2 }}>EV SAHİBİ</div>}
                          </div>
                        </div>
                        <div style={{ textAlign:'right', minWidth:120, flexShrink:0 }}>
                          {f.competition && <div style={{ fontSize:11, background:`${color}18`, color, padding:'3px 10px', borderRadius:20, fontWeight:700, display:'inline-block', marginBottom:4 }}>{f.competition}</div>}
                          {f.location && <div style={{ fontSize:11, color:'var(--text-muted)' }}>📍 {f.location}</div>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── CTA BANTI ─────────────────────────────── */}
      <div style={{ background:'var(--green)', padding:'100px 16px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Mesh gradient arka plan */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,0,0,.3), transparent), radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,40,15,.4), transparent)', pointerEvents:'none' }} />
        {/* Dönen logo */}
        {!logoError && effectiveLogo && (
          <img src={effectiveLogo} alt="" onError={() => setLogoError(true)}
            style={{ position:'absolute', right:'-5%', top:'50%', transform:'translateY(-50%)', width:'min(500px,55vw)', height:'auto', objectFit:'contain', opacity:.06, pointerEvents:'none', filter:'brightness(0) invert(1)', animation:'spin-slow 40s linear infinite' }} />
        )}
        <div style={{ position:'relative', zIndex:1 }}>
          <Reveal direction="up">
            <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.75)', letterSpacing:4, textTransform:'uppercase', marginBottom:20 }}>SPOR KULÜBÜMÜZE KATIL</div>
            <h2 style={{ fontFamily:'var(--font-display)', color:'#fff', fontSize:'clamp(52px,8vw,100px)', lineHeight:.92, letterSpacing:1, margin:'0 0 24px' }}>{settings.slogan?.toUpperCase() || 'ŞAMPIYONLARA GİDEN YOL'}</h2>
            <p style={{ color:'rgba(255,255,255,.8)', fontSize:17, maxWidth:500, margin:'0 auto 40px', lineHeight:1.7, fontWeight:400 }}>
              {settings.stats[0]?.value}+ aktif üyemizle birlikte sporu yaşa, şampiyonlara katıl.
            </p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              {!currentUser && (
                <button onClick={() => navigate('/kayit')} style={{ background:'#fff', color:'var(--green-dark)', border:'none', padding:'16px 40px', borderRadius:12, fontSize:16, fontWeight:800, cursor:'pointer', transition:'all .25s', boxShadow:'0 8px 30px rgba(0,0,0,.2)', fontFamily:'var(--font-body)' }}
                  onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 40px rgba(0,0,0,.3)' }}
                  onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,.2)' }}>
                  Üye Ol →
                </button>
              )}
              <button onClick={() => navigate('/branslar')} style={{ background:'rgba(255,255,255,.12)', color:'#fff', border:'2px solid rgba(255,255,255,.4)', padding:'16px 36px', borderRadius:12, fontSize:16, fontWeight:700, cursor:'pointer', transition:'all .25s', backdropFilter:'blur(10px)', fontFamily:'var(--font-body)' }}
                onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,.7)' }}
                onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,.12)'; e.currentTarget.style.borderColor='rgba(255,255,255,.4)' }}>
                Branşlarımız
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── MAĞAZA VITRIN ─────────────────────────────── */}
      <div style={{ background:'var(--dark)', padding:'96px 16px', borderTop:'1px solid var(--dark-border)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <Reveal direction="up">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>ÜSküDAR ANADOLU STORE</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,58px)', lineHeight:.95, color:'#fff', letterSpacing:.5, margin:0 }}>ÖNE ÇIKAN ÜRÜNLER</h2>
            </div>
            <Link to="/magaza" style={{ color:'var(--dark-muted)', fontWeight:600, fontSize:14, textDecoration:'none', display:'flex', alignItems:'center', gap:6, padding:'10px 20px', border:'1px solid var(--dark-border)', borderRadius:10, transition:'all .2s', color:'rgba(255,255,255,.6)' }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,.05)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='rgba(255,255,255,.25)' }}
              onMouseOut={e => { e.currentTarget.style.background=''; e.currentTarget.style.color='rgba(255,255,255,.6)'; e.currentTarget.style.borderColor='var(--dark-border)' }}>
              Tüm Ürünler →
            </Link>
          </div>
          </Reveal>
          <div className="home-store-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
            {[...Array(4)].map((_,i) => (
              <Reveal key={i} direction="up" delay={i * 0.1}>
              <div className="card-shine" onClick={() => navigate('/magaza')}
                style={{ background:'var(--dark-3)', borderRadius:16, overflow:'hidden', border:'1px solid var(--dark-border)', cursor:'pointer', transition:'transform .3s ease, border-color .3s ease, box-shadow .3s ease' }}
                onMouseOver={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(0,168,68,.4)'; e.currentTarget.style.boxShadow='0 20px 50px rgba(0,0,0,.4)' }}
                onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow='' }}>
                <div style={{ height:160, background:`linear-gradient(135deg,#0a2a14,#1a5e2a)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:56, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 30% 50%, rgba(0,168,68,.15), transparent 70%)' }} />
                  {['👕','🧥','🧢','⚽'][i]}
                </div>
                <div style={{ padding:'18px 16px' }}>
                  <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', marginBottom:6 }}>Kulüp</div>
                  <div style={{ fontWeight:700, fontSize:14, color:'#fff', marginBottom:10 }}>{['Resmi Forma','Kulüp Eşofmanı','Kulüp Şapkası','Resmi Maç Topu'][i]}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontFamily:'var(--font-display)', color:'var(--green-light)', fontSize:22 }}>{['450','680','180','350'][i]} ₺</div>
                    <div style={{ fontSize:13, color:'var(--dark-muted)', background:'rgba(255,255,255,.05)', padding:'5px 12px', borderRadius:6 }}>Sepete Ekle</div>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────── */}
    </div>
  )
}
