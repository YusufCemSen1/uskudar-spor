import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useSite } from '../context/SiteContext'

const BRANCH_COLOR = { Futbol:'#00913A', Basketbol:'#006B2B', Voleybol:'#00B548', 'Masa Tenisi':'#004d20' }
const BRANCH_ID    = { Futbol:'futbol', Basketbol:'basketbol', Voleybol:'voleybol', 'Masa Tenisi':'masatenisi' }

export default function BioPage() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { players } = useStore()
  const { settings, effectiveLogo } = useSite()

  // ── OYUNCU
  if (type === 'oyuncu') {
    let person = null
    let team = null
    for (const t of players) {
      const p = t.players?.find(pl => String(pl.id) === String(id))
      if (p) { person = p; team = t; break }
    }
    if (!person) return <NotFound />

    const color  = BRANCH_COLOR[team.branch] || '#00913A'
    const branchId = BRANCH_ID[team.branch] || 'futbol'
    const achievements = person.achievements || []

    return (
      <BioLayout
        color={color}
        image={person.image}
        name={person.name}
        subtitle={`${person.position} · ${team.team}`}
        tag={team.branch}
        onBack={() => navigate(`/branslar/${branchId}`)}
        backLabel={`← ${team.branch}`}
        stats={[
          person.number   && { label: 'Forma No',    value: `#${person.number}` },
          person.age      && { label: 'Yaş',         value: person.age },
          person.height   && { label: 'Boy',         value: `${person.height} cm` },
          person.weight   && { label: 'Kilo',        value: `${person.weight} kg` },
          person.nationality && { label: 'Milliyet', value: person.nationality },
          person.foot     && { label: 'Tercih Ayak', value: person.foot },
          person.birthYear && { label: 'Doğum Yılı', value: person.birthYear },
        ].filter(Boolean)}
        bio={person.bio}
        achievements={achievements}
        achievementsLabel="🏅 Başarılar"
        branch={team.branch}
        logo={effectiveLogo}
      />
    )
  }

  // ── YÖNETİM KURULU
  if (type === 'yonetim') {
    const board = settings.about?.board || []
    const person = board[parseInt(id)]
    if (!person) return <NotFound />

    return (
      <BioLayout
        color="#00913A"
        image={person.image}
        icon={person.icon || '👔'}
        name={person.name}
        subtitle={person.title}
        tag="Yönetim Kurulu"
        onBack={() => navigate('/hakkimizda')}
        backLabel="← Hakkımızda"
        stats={[
          person.email && { label: '✉️ E-posta', value: person.email },
          person.phone && { label: '📞 Telefon', value: person.phone },
        ].filter(Boolean)}
        bio={person.bio}
        branch="Yönetim"
        logo={effectiveLogo}
      />
    )
  }

  return <NotFound />
}

function NotFound() {
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ fontSize:48 }}>🔍</div>
      <div style={{ fontWeight:800, fontSize:18 }}>Sayfa bulunamadı</div>
      <Link to="/" style={{ color:'var(--green)' }}>Ana sayfaya dön</Link>
    </div>
  )
}

const SPORT_ICONS_MAP = {
  Futbol:        ['⚽','🥅','👟','🏆','⚽','🎯'],
  Basketbol:     ['🏀','🏆','👟','🎯','🏀','🥇'],
  Voleybol:         ['🏐','🌊','💧','🥽','🏆','🌀'],
  'Masa Tenisi': ['🏓','🏅','⚡','🎯','🏓','🏆'],
  Yönetim:       ['🏆','⭐','🤝','🎖️','👑','💎'],
  default:       ['🏆','⭐','🎯','🥇','🏅','💫'],
}

function SportsBgIcons({ branch, color, logo }) {
  const icons = SPORT_ICONS_MAP[branch] || SPORT_ICONS_MAP.default
  const positions = [
    { right:'5%',  top:'8%',  size:72, delay:'0s',   cls:'spin' },
    { right:'18%', top:'55%', size:48, delay:'1.4s',  cls:'slow' },
    { right:'32%', top:'12%', size:36, delay:'2.8s',  cls:'' },
    { left:'3%',   top:'20%', size:56, delay:'0.7s',  cls:'slow' },
    { left:'20%',  top:'65%', size:40, delay:'2.1s',  cls:'' },
    { right:'48%', top:'40%', size:30, delay:'3.5s',  cls:'glow' },
  ]
  return <>
    {/* Radyal glow */}
    <div className="sport-bg-glow" style={{ width:400, height:400, right:-80, top:-80, animationDelay:'0s' }} />
    <div className="sport-bg-glow" style={{ width:250, height:250, left:60, bottom:-40, animationDelay:'3s' }} />

    {/* Kulüp logosu — sağ üst, büyük ve soluk */}
    {logo && (
      <img src={logo} alt="" className="sport-bg-icon slow"
        style={{ right:'6%', top:'50%', transform:'translateY(-50%)', width:180, height:180, objectFit:'contain', opacity:.08, animationDelay:'0.5s', borderRadius:'50%', filter:'brightness(10) saturate(0)' }} />
    )}

    {/* 1908 yazısı — arka planda büyük */}
    <div className="sport-bg-icon glow"
      style={{ right:'8%', bottom:'10%', opacity:.09, animationDelay:'1.2s', fontFamily:'var(--font-display)', fontSize:96, color:'#fff', fontWeight:900, letterSpacing:4, lineHeight:1 }}>
      1908
    </div>

    {/* Spor ikonları */}
    {positions.map((p, i) => (
      <div key={i} className={`sport-bg-icon ${p.cls}`}
        style={{ ...p, fontSize:p.size, opacity:.12, animationDelay:p.delay }}>
        {icons[i % icons.length]}
      </div>
    ))}
  </>
}

function BioLayout({ color, image, icon, name, subtitle, tag, onBack, backLabel, stats, bio, achievements, achievementsLabel, branch, logo }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${color}ee,${color}77,#0a1a0a)`, minHeight:300, display:'flex', alignItems:'flex-end', padding:'0 0 40px', position:'relative', overflow:'hidden' }}>
        <SportsBgIcons branch={branch} color={color} logo={logo} />
        <div className="page-wrap" style={{ width:'100%', paddingTop:90 }}>
          <button onClick={onBack} style={{ background:'rgba(255,255,255,.15)', border:'none', color:'#fff', borderRadius:8, padding:'6px 14px', fontSize:12, cursor:'pointer', marginBottom:20, fontWeight:700 }}>{backLabel}</button>
          <div style={{ display:'flex', gap:24, alignItems:'flex-end', flexWrap:'wrap' }}>
            {/* Fotoğraf */}
            <div style={{ width:140, height:140, borderRadius:16, overflow:'hidden', border:'3px solid rgba(255,255,255,.3)', flexShrink:0, background:`${color}44`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {image
                ? <img src={image} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span style={{ fontSize:64, opacity:.7 }}>{icon || '👤'}</span>
              }
            </div>
            <div style={{ paddingBottom:6 }}>
              <div style={{ display:'inline-flex', background:'rgba(255,255,255,.15)', color:'#fff', fontSize:11, fontWeight:700, letterSpacing:2, padding:'4px 12px', borderRadius:20, marginBottom:10 }}>{tag}</div>
              <h1 style={{ color:'#fff', margin:'0 0 6px', fontSize:'clamp(24px,4vw,42px)', fontFamily:'var(--font-display)', lineHeight:1.1 }}>{name}</h1>
              <div style={{ color:'rgba(255,255,255,.75)', fontSize:15, fontWeight:600 }}>{subtitle}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrap" style={{ paddingTop:32 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:32, alignItems:'start' }}>
          <div>
            {/* Biyografi */}
            {bio && (
              <div style={{ background:'#fff', borderRadius:14, padding:28, border:'1px solid var(--border)', marginBottom:24 }}>
                <h3 style={{ margin:'0 0 14px', fontWeight:900, fontSize:17 }}>📄 Biyografi</h3>
                <p style={{ fontSize:14, lineHeight:1.9, color:'var(--text-muted)', margin:0, whiteSpace:'pre-line' }}>{bio}</p>
              </div>
            )}
            {!bio && (
              <div style={{ background:'#f9f9f9', borderRadius:14, padding:28, border:'1px dashed var(--border)', marginBottom:24, textAlign:'center', color:'var(--text-muted)' }}>
                <div style={{ fontSize:36, marginBottom:8 }}>📝</div>
                <p style={{ margin:0 }}>Biyografi henüz eklenmemiş.</p>
              </div>
            )}

            {/* Başarılar */}
            {achievements?.length > 0 && (
              <div style={{ background:'#fff', borderRadius:14, padding:28, border:'1px solid var(--border)' }}>
                <h3 style={{ margin:'0 0 16px', fontWeight:900, fontSize:17 }}>{achievementsLabel || '🏅 Başarılar'}</h3>
                <div style={{ display:'grid', gap:10 }}>
                  {achievements.map((a, i) => (
                    <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 14px', background:'var(--green-pale)', borderRadius:8 }}>
                      <span style={{ color:'var(--green)', fontWeight:900, fontSize:16, marginTop:1 }}>✓</span>
                      <span style={{ fontSize:14, lineHeight:1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sağ: İstatistikler */}
          <div style={{ position:'sticky', top:20 }}>
            {stats?.length > 0 && (
              <div style={{ background:'#fff', borderRadius:14, padding:24, border:'1px solid var(--border)', marginBottom:20 }}>
                <h3 style={{ margin:'0 0 16px', fontWeight:900, fontSize:16 }}>📋 Bilgiler</h3>
                <div style={{ display:'grid', gap:12 }}>
                  {stats.map(({ label, value }) => (
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                      <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight:600 }}>{label}</span>
                      <span style={{ fontSize:14, fontWeight:800, color:color }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
