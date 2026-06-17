import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const BRANCHES = [
  {
    id: 'futbol', icon: '⚽', name: 'Futbol', color: '#00913A',
    desc: 'Kulübümüzün en köklü branşı. A takımı, kadın takımı ve altyapı kategorilerinde yüzlerce sporcumuz sahada.',
    teams: ['A Takım', 'Kadın Takım', 'U-19', 'U-17', 'U-15'],
    achievements: ['Bölge Kupası Finalisti 2026', 'İl Şampiyonu 2024', 'Altyapı Kupası 2023'],
    schedule: 'Pzt, Çar, Cum: 17:00–19:00 · Hafta sonu: 10:00–12:00',
  },
  {
    id: 'basketbol', icon: '🏀', name: 'Basketbol', color: '#006B2B',
    desc: 'Erkek ve kadın takımlarımız bölge liginde mücadele ediyor. Genç yetenekler altyapımızda yetişiyor.',
    teams: ['Erkek Takım', 'Kadın Takım', 'U-18', 'U-14'],
    achievements: ['Bölge Ligi 2. si 2026', 'Kadın Takımı Şampiyonu 2025', 'En İyi Altyapı Ödülü 2024'],
    schedule: 'Sal, Per: 18:00–20:00 · Cumartesi: 11:00–13:00',
  },
  {
    id: 'voleybol', icon: '🏐', name: 'Voleybol', color: '#00B548',
    desc: 'Erkek ve kadın voleybol takımlarımız bölge liginde mücadele ediyor. Genç oyuncular altyapımızda yetişiyor.',
    teams: ['Erkek Takım', 'Kadın Takım', 'U-18', 'U-14'],
    achievements: ['Bölge Ligi Finalisti 2026', 'Kadın Takımı 2.si 2025', 'En İyi Altyapı 2024'],
    schedule: 'Sal, Per: 17:00–19:00 · Cumartesi: 10:00–12:00',
  },
  {
    id: 'masatenisi', icon: '🏓', name: 'Masa Tenisi', color: '#004d20',
    desc: 'Bölge liginde mücadele eden takımımız ve bireysel sporcularımız ulusal başarılara imza atıyor.',
    teams: ['Erkek Takım', 'Kadın Takım', 'Gençler'],
    achievements: ['İl Birincisi 2026', 'Bölge Şampiyonu 2025', 'Ulusal Turnuva 3.sü 2024'],
    schedule: 'Pzt-Cuma: 16:00–20:00 · Cumartesi: 10:00–14:00',
  },
]

export default function Branches() {
  const [active, setActive] = useState(null)
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }} className="anim-trackIn">SPOR DALLARI</div>
          <h1 className="anim-trackIn delay-1">🏆 Branşlarımız</h1>
          <p className="anim-trackIn delay-2">Dört branşta şampiyonlar yetiştiriyoruz</p>
        </div>
      </div>

      <div className="page-wrap">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
          {BRANCHES.map((b, i) => (
            <div key={b.id} className="hover-lift anim-trackIn border-shine"
              style={{ animationDelay:`${i*.12}s`, borderRadius:16, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer', background:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,.06)' }}
              onClick={() => setActive(active === b.id ? null : b.id)}>
              {/* Üst renk bandı */}
              <div style={{ background:`linear-gradient(135deg,${b.color},${b.color}cc)`, padding:'28px 24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.07)' }} />
                <div style={{ fontSize:48, marginBottom:10, animation:'float 3s ease-in-out infinite', animationDelay:`${i*.5}s` }}>{b.icon}</div>
                <div style={{ color:'#fff', fontWeight:900, fontSize:22, letterSpacing:.5 }}>{b.name}</div>
                <div style={{ color:'rgba(255,255,255,.7)', fontSize:12, marginTop:4 }}>{b.teams.length} takım · {b.achievements.length} başarı</div>
              </div>

              <div style={{ padding:'20px 24px' }}>
                <p style={{ fontSize:13, color:'var(--text-muted)', lineHeight:1.7, marginBottom:16 }}>{b.desc}</p>

                {/* Takımlar */}
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                  {b.teams.map(t => (
                    <span key={t} style={{ background:'var(--green-pale)', color:'var(--green-dark)', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20 }}>{t}</span>
                  ))}
                </div>

                {/* Detay toggle */}
                {active === b.id && (
                  <div className="anim-trackIn">
                    <div style={{ borderTop:'1px solid var(--border)', paddingTop:14, marginBottom:14 }}>
                      <div style={{ fontWeight:800, fontSize:12, color:'var(--text-muted)', marginBottom:8, letterSpacing:.5 }}>🏅 BAŞARILAR</div>
                      {b.achievements.map(a => (
                        <div key={a} style={{ display:'flex', gap:8, fontSize:13, marginBottom:6, alignItems:'flex-start' }}>
                          <span style={{ color:'var(--green)', fontWeight:900 }}>✓</span><span>{a}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:'var(--green-pale)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'var(--green-dark)' }}>
                      <strong>⏰ Antrenman Saatleri:</strong><br />{b.schedule}
                    </div>
                  </div>
                )}

                <div style={{ marginTop:12, display:'flex', gap:10, alignItems:'center' }}>
                  <button style={{ background:'none', border:'none', color:'var(--green)', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                    {active === b.id ? 'Daha Az Gör ▲' : 'Detaylar ▼'}
                  </button>
                  <Link to={`/branslar/${b.id}`} onClick={e => e.stopPropagation()}
                    style={{ marginLeft:'auto', background:'var(--green)', color:'#fff', borderRadius:8, padding:'6px 14px', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                    Sayfaya Git →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alt CTA */}
        <div className="animated-bg anim-trackIn" style={{ borderRadius:16, padding:'40px 32px', textAlign:'center', marginTop:40, position:'relative', overflow:'hidden' }}>
          <h3 style={{ color:'#fff', fontSize:22, fontWeight:900, margin:'0 0 10px' }}>Spora Başlamak İster misin?</h3>
          <p style={{ color:'rgba(255,255,255,.8)', fontSize:14, margin:'0 0 20px' }}>Üyelik başvurusu yaparak dilediğin branşta antrenman yapmaya başla.</p>
          <button className="btn btn-yellow btn-ripple hover-lift" onClick={() => navigate('/uyelik')}>Üye Ol →</button>
        </div>
      </div>
    </div>
  )
}
