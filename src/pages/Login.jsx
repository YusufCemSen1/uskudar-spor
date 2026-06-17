import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { useToast } from '../components/Toast'

const DarkInput = ({ type='text', value, onChange, onKeyDown, placeholder, right }) => {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', background:'rgba(255,255,255,.06)', border:`1px solid ${focused?'var(--green)':'var(--dark-border)'}`,
          borderRadius:10, padding: right ? '13px 44px 13px 16px' : '13px 16px', color:'#fff', fontSize:14,
          outline:'none', transition:'border-color .2s', fontFamily:'var(--font-body)' }} />
      {right}
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const { settings, effectiveLogo } = useSite()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [logoErr, setLogoErr] = useState(false)

  const handleSubmit = () => {
    if (!form.email || !form.password) { toast('Tüm alanları doldurun.', 'error'); return }
    setLoading(true)
    setTimeout(() => {
      const result = login(form.email, form.password)
      if (result.success) {
        toast(`Hoş geldiniz, ${result.user.name.split(' ')[0]}!`)
        if (result.user.role === 'admin') navigate('/panel')
        else navigate('/')
      } else {
        toast(result.message || 'Giriş başarısız.', 'error')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--dark)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', position:'relative', overflow:'hidden', boxSizing:'border-box' }}>
      <div style={{ position:'absolute', top:'8%', left:'8%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,168,68,.14) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'8%', right:'8%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,168,68,.09) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', position:'relative', marginBottom:14 }}>
            {!logoErr && effectiveLogo
              ? <img src={effectiveLogo} onError={() => setLogoErr(true)} style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'2px solid var(--green)' }} />
              : <div style={{ width:72, height:72, background:'var(--green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30 }}>⚽</div>
            }
            <div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:'1px solid rgba(0,168,68,.25)', animation:'spin 10s linear infinite', pointerEvents:'none' }} />
          </div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:26, color:'#fff', letterSpacing:3, lineHeight:1 }}>{settings.clubShort}</div>
          <div style={{ fontSize:10, color:'var(--dark-muted)', letterSpacing:3, textTransform:'uppercase', marginTop:4 }}>{settings.clubSub}</div>
        </div>

        <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--dark-border)', borderRadius:16, padding:'36px 32px', backdropFilter:'blur(16px)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:38, color:'#fff', letterSpacing:2, marginBottom:6 }}>GİRİŞ YAP</h2>
          <p style={{ color:'var(--dark-muted)', fontSize:13, marginBottom:28 }}>Hesabına erişmek için bilgilerini gir</p>

          <div style={{ display:'grid', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:2, color:'var(--dark-muted)', textTransform:'uppercase', marginBottom:8 }}>E-posta</label>
              <DarkInput type="email" value={form.email} placeholder="ornek@mail.com"
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:10, fontWeight:700, letterSpacing:2, color:'var(--dark-muted)', textTransform:'uppercase', marginBottom:8 }}>Şifre</label>
              <DarkInput type={show ? 'text' : 'password'} value={form.password} placeholder="••••••••"
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                right={
                  <button onClick={() => setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--dark-muted)', cursor:'pointer', fontSize:16 }}>
                    {show ? '🙈' : '👁️'}
                  </button>
                } />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ marginTop:6, background: loading ? 'var(--green-dark)' : 'var(--green)', border:'none', borderRadius:10, padding:'14px', color:'#fff', fontSize:14, fontWeight:700, cursor: loading ? 'default' : 'pointer', letterSpacing:.5, transition:'background .2s' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = 'var(--green-light)' }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.background = 'var(--green)' }}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </div>

          <div style={{ textAlign:'center', marginTop:22, fontSize:13, color:'var(--dark-muted)' }}>
            Hesabın yok mu?{' '}
            <Link to="/kayit" style={{ color:'var(--green)', fontWeight:700, textDecoration:'none' }}>Üye Ol</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
