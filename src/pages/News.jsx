import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'

const CATS = ['Tümü', 'Futbol', 'Basketbol', 'Voleybol', 'Masa Tenisi', 'Genel']

function ImageGallery({ images, icon }) {
  const [active, setActive] = useState(0)
  if (!images || images.length === 0) return (
    <div style={{ height:320, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, borderRadius:12 }}>
      <span style={{ animation:'float 3s ease-in-out infinite' }}>{icon}</span>
    </div>
  )
  return (
    <div style={{ borderRadius:12, overflow:'hidden' }}>
      <div style={{ position:'relative', height:360 }}>
        <img src={images[active]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(a => (a-1+images.length)%images.length)}
              style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,.5)', color:'#fff', border:'none', borderRadius:'50%', width:38, height:38, fontSize:20, cursor:'pointer' }}>‹</button>
            <button onClick={() => setActive(a => (a+1)%images.length)}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'rgba(0,0,0,.5)', color:'#fff', border:'none', borderRadius:'50%', width:38, height:38, fontSize:20, cursor:'pointer' }}>›</button>
            <div style={{ position:'absolute', bottom:10, right:14, background:'rgba(0,0,0,.55)', color:'#fff', fontSize:11, padding:'3px 10px', borderRadius:12 }}>{active+1}/{images.length}</div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div style={{ display:'flex', gap:8, padding:'10px 0', overflowX:'auto' }}>
          {images.map((img,i) => (
            <img key={i} src={img} onClick={() => setActive(i)}
              style={{ width:72, height:52, objectFit:'cover', borderRadius:6, cursor:'pointer', flexShrink:0,
                border: i===active ? '2px solid var(--green)' : '2px solid transparent', opacity: i===active ? 1 : .6, transition:'all .15s' }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function News() {
  const { news } = useStore()
  const [cat, setCat] = useState('Tümü')
  const [selected, setSelected] = useState(null)

  const published = news.filter(n => n.published)
  const filtered = cat === 'Tümü' ? published : published.filter(n => n.category === cat)

  if (selected) {
    const n = news.find(x => x.id === selected)
    if (!n) { setSelected(null); return null }
    const images = n.images?.length ? n.images : (n.image ? [n.image] : [])
    return (
      <div>
        <div className="page-header">
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:2, marginBottom:8 }} className="anim-trackIn">{n.category}</div>
            <h1 className="anim-trackIn delay-1" style={{ marginBottom:8 }}>{n.title}</h1>
            <p className="anim-trackIn delay-2">📅 {n.date}</p>
          </div>
        </div>
        <div style={{ maxWidth:760, margin:'0 auto', padding:'32px 20px 60px' }}>
          <div className="anim-ballIn"><ImageGallery images={images} icon={n.icon} /></div>
          <div style={{ marginTop:28 }}>
            <button className="btn btn-secondary btn-sm hover-lift" style={{ marginBottom:24 }} onClick={() => setSelected(null)}>← Haberlere Dön</button>
            <p style={{ fontSize:16, lineHeight:1.9, color:'var(--text)', whiteSpace:'pre-wrap' }}>{n.content}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }} className="anim-trackIn">KULÜP HABERLERİ</div>
          <h1 className="anim-trackIn delay-1">📰 Haberler</h1>
          <p className="anim-trackIn delay-2">Kulübümüzden en güncel gelişmeler</p>
        </div>
      </div>
      <div className="page-wrap">
        <div className="filter-tabs" style={{ marginBottom:28 }}>
          {CATS.map(c => (
            <button key={c} className={`filter-tab${cat===c?' active':''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        {filtered.length === 0
          ? <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text-muted)' }}><div style={{ fontSize:48, marginBottom:12 }}>📭</div>Bu kategoride haber yok.</div>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
              {filtered.map((n, i) => {
                const thumb = n.images?.[0] || n.image
                return (
                  <div key={n.id} className="news-card hover-lift anim-trackIn" style={{ animationDelay:`${i*.07}s`, borderRadius:14, overflow:'hidden', border:'1px solid var(--border)', cursor:'pointer', background:'#fff', boxShadow:'0 2px 12px rgba(0,0,0,.05)' }}
                    onClick={() => setSelected(n.id)}>
                    <div style={{ height:180, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
                      {thumb
                        ? <img src={thumb} alt={n.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }}
                            onMouseOver={e => e.target.style.transform='scale(1.08)'} onMouseOut={e => e.target.style.transform='scale(1)'} />
                        : <span style={{ fontSize:52, animation:'float 3s ease-in-out infinite' }}>{n.icon}</span>
                      }
                      {n.images?.length > 1 && (
                        <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,.6)', color:'#fff', fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:700 }}>📷 {n.images.length}</div>
                      )}
                      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:'linear-gradient(transparent,rgba(0,0,0,.4))' }} />
                    </div>
                    <div style={{ padding:'16px 18px 18px' }}>
                      <span style={{ background:'var(--green-pale)', color:'var(--green-dark)', fontSize:10, fontWeight:800, padding:'3px 9px', borderRadius:12, letterSpacing:.5 }}>{n.category}</span>
                      <div style={{ fontWeight:800, fontSize:15, marginTop:10, lineHeight:1.35, color:'var(--text)' }}>{n.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:6, lineHeight:1.6 }}>{n.content?.slice(0,90)}...</div>
                      <div style={{ marginTop:12, fontSize:11, color:'var(--text-muted)', display:'flex', alignItems:'center', gap:5 }}>📅 {n.date}</div>
                    </div>
                  </div>
                )
              })}
            </div>
        }
      </div>
    </div>
  )
}
