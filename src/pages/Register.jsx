import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/Toast'

const DarkInput = ({ type='text', value, onChange, placeholder, children, style={} }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', background:'rgba(255,255,255,.06)', border:`1px solid ${focused?'var(--green)':'var(--dark-border)'}`,
          borderRadius:10, padding:'12px 16px', color:'#fff', fontSize:13, outline:'none',
          transition:'border-color .2s', fontFamily:'var(--font-body)', ...style }} />
      {children}
    </div>
  )
}

const DarkSelect = ({ value, onChange, options }) => {
  const [focused, setFocused] = useState(false)
  return (
    <select value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width:'100%', background:'rgba(255,255,255,.06)', border:`1px solid ${focused?'var(--green)':'var(--dark-border)'}`,
        borderRadius:10, padding:'12px 16px', color:'#fff', fontSize:13, outline:'none',
        transition:'border-color .2s', fontFamily:'var(--font-body)', cursor:'pointer' }}>
      {options.map(o => <option key={o} value={o} style={{ background:'#1a2a1a' }}>{o}</option>)}
    </select>
  )
}

const Label = ({ children }) => (
  <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:2, color:'var(--dark-muted)', textTransform:'uppercase', marginBottom:7 }}>{children}</label>
)

export default function Register() {
  const { register } = useAuth()
  const { addMember } = useStore()
  const { effectiveLogo } = useSite()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', password2:'', phone:'', branch:'Futbol' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) { toast('Ad, e-posta ve şifre zorunlu.', 'error'); return }
    if (form.password.length < 6) { toast('Şifre en az 6 karakter olmalı.', 'error'); return }
    if (form.password !== form.password2) { toast('Şifreler eşleşmiyor.', 'error'); return }
    setLoading(true)
    setTimeout(() => {
      const res = register(form)
      setLoading(false)
      if (res.success) {
        addMember({ name: form.name, email: form.email, phone: form.phone || '', branch: form.branch || 'Futbol', plan: 'Standart', status: 'pending' })
        navigate('/basvuru-basarili')
      } else {
        toast(res.message, 'error')
      }
    }, 500)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', overflow:'hidden', boxSizing:'border-box' }}>
      <div style={{ position:'absolute', top:'5%', right:'5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,168,68,.12) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'5%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,168,68,.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:500 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ display:'inline-flex', position:'relative', marginBottom:12 }}>
            {!logoError && effectiveLogo
              ? <img src={effectiveLogo} onError={() => setLogoError(true)} style={{ width:64, height:64, borderRadius:'50%', objectFit:'cover', border:'2px solid var(--green)' }} />
              : <div style={{ width:64, height:64, background:'var(--green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>🎽</div>
            }
            <div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:'1px solid rgba(0,168,68,.25)', animation:'spin 10s linear infinite', pointerEvents:'none' }} />
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:34, color:'#fff', letterSpacing:2, lineHeight:1 }}>ÜYE OL</div>
          <div style={{ fontSize:12, color:'var(--dark-muted)', marginTop:6 }}>Üsküdar Anadolu Spor Kulübü ailesine katıl</div>
        </div>

        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--dark-border)', borderRadius:16, padding:'32px 28px', backdropFilter:'blur(16px)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14 }}>
            <div style={{ gridColumn:'1/-1' }}>
              <Label>Ad Soyad *</Label>
              <DarkInput value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Adınız Soyadınız" />
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <Label>E-posta *</Label>
              <DarkInput type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="ornek@mail.com" />
            </div>
            <div>
              <Label>Şifre *</Label>
              <DarkInput type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="En az 6 karakter" style={{ paddingRight:40 }}>
                <button onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, color:'var(--dark-muted)' }}>{showPw?'🙈':'👁️'}</button>
              </DarkInput>
            </div>
            <div>
              <Label>Şifre Tekrar *</Label>
              <DarkInput type={showPw ? 'text' : 'password'} value={form.password2} onChange={e => setForm({...form, password2:e.target.value})} placeholder="Tekrar girin" />
            </div>
            <div>
              <Label>Telefon</Label>
              <DarkInput value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} placeholder="0 5XX XXX XX XX" />
            </div>
            <div>
              <Label>Branş</Label>
              <DarkSelect value={form.branch} onChange={e => setForm({...form, branch:e.target.value})} options={['Futbol','Basketbol','Voleybol','Masa Tenisi']} />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ marginTop:20, width:'100%', background: loading ? 'var(--green-dark)' : 'var(--green)', border:'none', borderRadius:10, padding:'14px', color:'#fff', fontSize:14, fontWeight:700, cursor: loading ? 'default' : 'pointer', letterSpacing:.5, transition:'background .2s' }}
            onMouseOver={e => { if(!loading) e.currentTarget.style.background='var(--green-light)' }}
            onMouseOut={e => { if(!loading) e.currentTarget.style.background='var(--green)' }}>
            {loading ? 'Kaydediliyor...' : 'Başvuruyu Gönder →'}
          </button>

          <p style={{ fontSize:11, color:'var(--dark-muted)', marginTop:10, textAlign:'center', lineHeight:1.6 }}>
            Başvurunuz yönetici onayından sonra aktif olacaktır.
          </p>
          <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:'var(--dark-muted)' }}>
            Hesabınız var mı?{' '}
            <Link to="/giris" style={{ color:'var(--green)', fontWeight:700, textDecoration:'none' }}>Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
