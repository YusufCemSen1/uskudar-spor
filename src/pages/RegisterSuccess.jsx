import React from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

export default function RegisterSuccess() {
  const { effectiveLogo } = useSite()
  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 24px', boxShadow:'0 0 40px rgba(0,145,58,.4)' }}>✓</div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:36, color:'#fff', marginBottom:12, letterSpacing:1 }}>BAŞVURUNUZ İLETİLDİ</h1>
        <p style={{ color:'rgba(255,255,255,.65)', fontSize:15, lineHeight:1.7, marginBottom:8 }}>
          Üyelik başvurunuz alındı. Yönetim Kurulu tarafından <strong style={{ color:'#fff' }}>5-10 iş günü</strong> içinde değerlendirilecek ve sonuç e-posta ile bildirilecektir.
        </p>
        <p style={{ color:'rgba(255,255,255,.45)', fontSize:13, marginBottom:32 }}>
          Giriş yaparak başvuru durumunuzu takip edebilirsiniz.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/giris" style={{ background:'var(--green)', color:'#fff', padding:'12px 28px', borderRadius:10, fontWeight:800, textDecoration:'none', fontSize:14 }}>
            Giriş Yap →
          </Link>
          <Link to="/" style={{ background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', padding:'12px 28px', borderRadius:10, fontWeight:700, textDecoration:'none', fontSize:14, border:'1px solid rgba(255,255,255,.1)' }}>
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
