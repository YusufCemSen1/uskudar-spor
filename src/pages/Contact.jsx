import React, { useState } from 'react'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/Toast'
import Reveal from '../components/Reveal'

const DarkInput = ({ type='text', value, onChange, placeholder, textarea=false }) => {
  const [focused, setFocused] = useState(false)
  const baseStyle = {
    width:'100%', background:'rgba(255,255,255,.06)', border:`1px solid ${focused?'var(--green)':'var(--dark-border)'}`,
    borderRadius:10, padding:'13px 16px', color:'#fff', fontSize:14, outline:'none',
    transition:'border-color .2s', fontFamily:'var(--font-body)', resize:'vertical'
  }
  return textarea
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={5}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={baseStyle} />
    : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={baseStyle} />
}

const Label = ({ children }) => (
  <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:2, color:'var(--dark-muted)', textTransform:'uppercase', marginBottom:8 }}>{children}</label>
)

export default function Contact() {
  const { contact } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

  const send = () => {
    if (!form.name || !form.email || !form.message) { toast('Tüm alanları doldurun', 'error'); return }
    setSent(true); toast('Mesajınız gönderildi!')
    setTimeout(() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }, 3000)
  }

  const INFO = [
    { icon:'📍', label:'Adres', value: contact.address },
    { icon:'📞', label:'Telefon', value: contact.phone },
    { icon:'✉️', label:'E-posta', value: contact.email },
    { icon:'⏰', label:'Çalışma Saatleri', value: contact.hours },
  ]
  const SOCIAL = [
    { icon:'📸', label:'Instagram', handle:`@${contact.instagram}` },
    { icon:'🐦', label:'Twitter', handle:`@${contact.twitter}` },
    { icon:'👥', label:'Facebook', handle:`/${contact.facebook}` },
  ]

  return (
    <div style={{ background:'var(--dark)', minHeight:'100vh' }}>
      {/* Page Header */}
      <div style={{ background:'var(--dark-2)', borderBottom:'1px solid var(--dark-border)', padding:'80px 32px 60px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)', backgroundSize:'60px 60px' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'linear-gradient(90deg, transparent, var(--green), transparent)' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:4, color:'var(--green)', textTransform:'uppercase', marginBottom:12 }}>BİZE ULAŞIN</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(40px,6vw,72px)', color:'#fff', letterSpacing:2, lineHeight:1, marginBottom:12 }}>İLETİŞİM</h1>
          <p style={{ color:'var(--dark-muted)', fontSize:16 }}>Sorularınız için her zaman buradayız</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:32, alignItems:'start' }}>
          {/* Left: Info */}
          <div style={{ display:'grid', gap:16 }}>
            <Reveal direction="left">
              <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--dark-border)', borderRadius:14, padding:'28px 24px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:'#fff', letterSpacing:1, marginBottom:20 }}>İLETİŞİM BİLGİLERİ</div>
                <div style={{ display:'grid', gap:12 }}>
                  {INFO.map((item,i) => (
                    <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'14px 16px', background:'rgba(0,168,68,.06)', border:'1px solid rgba(0,168,68,.12)', borderRadius:10, transition:'border-color .2s, background .2s', cursor:'default' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor='rgba(0,168,68,.3)'; e.currentTarget.style.background='rgba(0,168,68,.1)' }}
                      onMouseOut={e => { e.currentTarget.style.borderColor='rgba(0,168,68,.12)'; e.currentTarget.style.background='rgba(0,168,68,.06)' }}>
                      <div style={{ width:40, height:40, background:'rgba(0,168,68,.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, color:'var(--green)', textTransform:'uppercase', marginBottom:4 }}>{item.label}</div>
                        <div style={{ fontSize:14, color:'var(--dark-text)', fontWeight:500 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1}>
              <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--dark-border)', borderRadius:14, padding:'24px' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:18, color:'#fff', letterSpacing:1, marginBottom:16 }}>SOSYAL MEDYA</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                  {SOCIAL.map((s,i) => (
                    <div key={i} style={{ background:'rgba(0,168,68,.06)', border:'1px solid rgba(0,168,68,.12)', borderRadius:10, padding:'14px 10px', textAlign:'center', cursor:'pointer', transition:'all .2s' }}
                      onMouseOver={e => { e.currentTarget.style.background='rgba(0,168,68,.15)'; e.currentTarget.style.borderColor='var(--green)'; e.currentTarget.style.transform='translateY(-2px)' }}
                      onMouseOut={e => { e.currentTarget.style.background='rgba(0,168,68,.06)'; e.currentTarget.style.borderColor='rgba(0,168,68,.12)'; e.currentTarget.style.transform='none' }}>
                      <div style={{ fontSize:24, marginBottom:6 }}>{s.icon}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:'var(--green)', letterSpacing:.5 }}>{s.label}</div>
                      <div style={{ fontSize:11, color:'var(--dark-muted)', marginTop:2 }}>{s.handle}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Form */}
          <Reveal direction="right">
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--dark-border)', borderRadius:14, padding:'32px 28px' }}>
              {sent
                ? <div style={{ textAlign:'center', padding:'48px 0' }}>
                    <div style={{ fontSize:64, marginBottom:16 }}>✅</div>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--green)', letterSpacing:1, marginBottom:8 }}>MESAJINIZ İLETİLDİ</div>
                    <p style={{ color:'var(--dark-muted)', fontSize:14 }}>En kısa sürede size dönüş yapacağız.</p>
                  </div>
                : <>
                    <div style={{ fontFamily:'var(--font-display)', fontSize:28, color:'#fff', letterSpacing:1, marginBottom:24 }}>MESAJ GÖNDER</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                      <div><Label>Ad Soyad *</Label><DarkInput value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Ahmet Yılmaz" /></div>
                      <div><Label>E-posta *</Label><DarkInput type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="mail@ornek.com" /></div>
                    </div>
                    <div style={{ marginBottom:16 }}><Label>Konu</Label><DarkInput value={form.subject} onChange={e => setForm(f=>({...f,subject:e.target.value}))} placeholder="Mesaj konusu" /></div>
                    <div style={{ marginBottom:24 }}><Label>Mesajınız *</Label><DarkInput textarea value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} placeholder="Mesajınızı yazın..." /></div>
                    <button onClick={send}
                      style={{ width:'100%', background:'var(--green)', border:'none', borderRadius:10, padding:'14px', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', letterSpacing:.5, transition:'background .2s' }}
                      onMouseOver={e => e.currentTarget.style.background='var(--green-light)'}
                      onMouseOut={e => e.currentTarget.style.background='var(--green)'}>
                      Gönder ✉️
                    </button>
                  </>
              }
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
