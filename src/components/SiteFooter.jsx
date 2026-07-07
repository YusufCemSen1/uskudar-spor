import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

const SOCIAL_ICONS = {
  Instagram: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.055 1.805.249 2.227.415.56.217.96.477 1.382.896.419.42.679.82.896 1.381.164.422.36 1.057.413 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.413 2.227a3.7 3.7 0 0 1-.896 1.382 3.7 3.7 0 0 1-1.382.896c-.422.164-1.057.36-2.227.413-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.413a3.7 3.7 0 0 1-1.381-.896 3.7 3.7 0 0 1-.896-1.382c-.164-.422-.36-1.057-.413-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.413-2.227a3.7 3.7 0 0 1 .896-1.381A3.7 3.7 0 0 1 4.923 2.648c.422-.164 1.057-.36 2.227-.413C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.902.333 4.14.63a5.86 5.86 0 0 0-2.126 1.384A5.86 5.86 0 0 0 .63 4.14C.333 4.902.131 5.775.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.059 1.277.261 2.15.558 2.912a5.86 5.86 0 0 0 1.384 2.126 5.86 5.86 0 0 0 2.126 1.384c.763.297 1.635.499 2.912.558C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.059 2.15-.261 2.912-.558a5.86 5.86 0 0 0 2.126-1.384 5.86 5.86 0 0 0 1.384-2.126c.297-.763.499-1.635.558-2.912C23.986 15.668 24 15.259 24 12s-.014-3.668-.072-4.948c-.059-1.277-.261-2.15-.558-2.912a5.86 5.86 0 0 0-1.384-2.126A5.86 5.86 0 0 0 19.86.63C19.098.333 18.225.131 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  Twitter:   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>,
  Facebook:  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.027 4.388 11.02 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.234 2.686.234v2.97h-1.514c-1.491 0-1.956.928-1.956 1.879v2.258h3.328l-.532 3.49h-2.796v8.437C19.612 23.093 24 18.1 24 12.073z"/></svg>,
  YouTube:   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
}

export default function SiteFooter() {
  const { settings, effectiveLogo, contact } = useSite()
  const [logoError, setLogoError] = useState(false)

  return (
    <footer style={{ background:'var(--dark)', borderTop:'1px solid var(--dark-border)', color:'#fff', padding:'72px 16px 32px' }}>
      <div style={{ maxWidth:1280, margin:'0 auto' }}>
        <div className="home-footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:56 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              {!logoError && effectiveLogo
                ? <img src={effectiveLogo} alt="logo" onError={() => setLogoError(true)} style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(0,168,68,.4)' }} />
                : <div style={{ width:52, height:52, background:'var(--green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>⚽</div>
              }
              <div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:20, letterSpacing:.5, color:'#fff' }}>{settings.clubShort}</div>
                <div style={{ fontSize:10, color:'var(--dark-muted)', letterSpacing:1.5, textTransform:'uppercase' }}>{settings.clubSub}</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.9, color:'var(--dark-muted)', maxWidth:280 }}>{settings.footerAbout}</p>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              {[
                { name:'Instagram', url: contact?.instagram ? `https://www.instagram.com/${contact.instagram}/` : 'https://www.instagram.com/uskudaranadolusk/' },
                { name:'Twitter',   url: contact?.twitter   ? `https://twitter.com/${contact.twitter}` : '#' },
                { name:'Facebook',  url: contact?.facebook  ? `https://facebook.com/${contact.facebook}` : '#' },
                { name:'YouTube',   url: contact?.youtube   ? `https://youtube.com/@${contact.youtube}` : '#' },
              ].map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ width:36, height:36, background:'var(--dark-card)', border:'1px solid var(--dark-border)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,.6)', transition:'all .2s', textDecoration:'none' }}
                  onMouseOver={e => { e.currentTarget.style.background='var(--green)'; e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.color='#fff' }}
                  onMouseOut={e => { e.currentTarget.style.background='var(--dark-card)'; e.currentTarget.style.borderColor='var(--dark-border)'; e.currentTarget.style.color='rgba(255,255,255,.6)' }}>
                  {SOCIAL_ICONS[name]}
                </a>
              ))}
            </div>
          </div>
          {[
            ['SAYFALAR', [['Haberler','/haberler'],['Branşlar','/branslar'],['Hakkımızda','/hakkimizda'],['Üyelik','/uyelik'],['Mağaza','/magaza'],['İletişim','/iletisim']]],
            ['BRANŞLAR', [['Futbol','/branslar/futbol'],['Basketbol','/branslar/basketbol'],['Voleybol','/branslar/voleybol'],['Masa Tenisi','/branslar/masatenisi']]],
            ['İLETİŞİM', [['📍 Üsküdar, İstanbul','#'],['📞 0545 812 1908','#'],['✉️ info@uskudaranadolu.com','#'],['🕐 Pzt-Cmt: 07-22','#']]],
          ].map(([title, links]) => (
            <div key={title}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, color:'var(--dark-muted)', textTransform:'uppercase', marginBottom:20 }}>{title}</div>
              {links.map(([label, to]) => (
                <div key={label} style={{ marginBottom:12 }}>
                  <Link to={to} style={{ color:'rgba(255,255,255,.55)', fontSize:13, textDecoration:'none', transition:'color .2s, padding-left .2s', display:'block' }}
                    onMouseOver={e => { e.target.style.color='#fff'; e.target.style.paddingLeft='6px' }}
                    onMouseOut={e => { e.target.style.color='rgba(255,255,255,.55)'; e.target.style.paddingLeft='0' }}>{label}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--dark-border)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'var(--dark-muted)' }}>© {new Date().getFullYear()} {settings.clubName}. Tüm hakları saklıdır.</div>
          <div style={{ display:'flex', gap:4 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)', marginTop:2 }} />
            <span style={{ fontSize:12, color:'var(--dark-muted)' }}>Türkiye'de kuruldu</span>
          </div>
        </div>
        <div style={{ borderTop:'1px solid var(--dark-border)', paddingTop:14, marginTop:14, textAlign:'center', fontSize:12, color:'rgba(255,255,255,.3)' }}>
          Tasarım &amp; Geliştirme{' '}
          <a href="https://yusufcemsen1.github.io/" target="_blank" rel="noopener noreferrer"
            style={{ color:'rgba(255,255,255,.55)', fontWeight:700, textDecoration:'none' }}
            onMouseOver={e => e.target.style.color='#4ade80'}
            onMouseOut={e => e.target.style.color='rgba(255,255,255,.55)'}>
            Yusuf Cem Şen
          </a>
        </div>
      </div>
    </footer>
  )
}
