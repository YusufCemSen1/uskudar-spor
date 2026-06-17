import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useShop } from '../context/ShopContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/Toast'
import { useIsMobile } from '../hooks/useIsMobile'

function Stars({ rating, size=14 }) {
  return <span style={{ color:'#FF9800', fontSize:size }}>{[1,2,3,4,5].map(i=><span key={i}>{i<=Math.round(rating)?'★':'☆'}</span>)}</span>
}

export default function Profile() {
  const { currentUser, updateUser, logout } = useAuth()
  const { orders, favorites } = useShop()
  const { products } = useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') || 'info')
  const [form, setForm] = useState({ name: currentUser?.name||'', email: currentUser?.email||'', phone: currentUser?.phone||'' })
  const [pwForm, setPwForm] = useState({ current:'', next:'', next2:'' })
  const isMobile = useIsMobile()

  if (!currentUser) { navigate('/giris'); return null }

  const favProducts = products.filter(p => favorites.includes(p.id))
  const orderStatus = { processing:'🟡 Hazırlanıyor', shipped:'🔵 Kargoda', delivered:'🟢 Teslim Edildi', cancelled:'🔴 İptal' }

  const saveInfo = () => {
    if (!form.name) { toast('Ad zorunlu.','error'); return }
    updateUser(currentUser.id, { name:form.name, phone:form.phone, avatar: form.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() })
    toast('Bilgiler güncellendi ✓')
  }

  const savePassword = () => {
    if (pwForm.current !== currentUser.password) { toast('Mevcut şifre hatalı.','error'); return }
    if (pwForm.next.length < 6) { toast('Yeni şifre en az 6 karakter.','error'); return }
    if (pwForm.next !== pwForm.next2) { toast('Şifreler eşleşmiyor.','error'); return }
    updateUser(currentUser.id, { password: pwForm.next })
    toast('Şifre güncellendi ✓')
    setPwForm({ current:'', next:'', next2:'' })
  }

  const TABS = [
    { key:'info',   label:'👤 Bilgilerim' },
    { key:'orders', label:'📦 Siparişlerim' },
    { key:'favs',   label:'❤️ Favorilerim' },
    { key:'pw',     label:'🔐 Şifre' },
  ]

  return (
    <div style={{ background:'var(--gray-bg)', minHeight:'100vh' }}>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }} className="anim-trackIn">HESABIM</div>
          <h1 className="anim-trackIn delay-1">👤 Profilim</h1>
          <p className="anim-trackIn delay-2">{currentUser.name}</p>
        </div>
      </div>
      <div className="page-wrap">
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap:22 }}>
          {/* Sol */}
          <div className="anim-trackIn">
            <div className="hover-glow" style={{ background:'#fff', borderRadius:12, border:'1px solid var(--border)', overflow:'hidden', marginBottom:14, boxShadow:'0 4px 20px rgba(0,0,0,.05)', transition:'box-shadow .3s' }}>
              <div style={{ background:'linear-gradient(135deg,var(--green-dark),var(--green))', padding:'24px 20px', textAlign:'center' }}>
                <div className="anim-jerseyPop" style={{ width:64, height:64, background:'rgba(255,255,255,.2)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', margin:'0 auto 10px', border:'3px solid rgba(255,255,255,.3)' }}>
                  {currentUser.avatar || currentUser.name?.slice(0,2).toUpperCase()}
                </div>
                <div style={{ color:'#fff', fontWeight:800, fontSize:14 }}>{currentUser.name}</div>
                <div style={{ color:'rgba(255,255,255,.7)', fontSize:12, marginTop:2 }}>{currentUser.email}</div>
              </div>
              {TABS.map(t=>(
                <div key={t.key} onClick={()=>setTab(t.key)}
                  style={{ padding:'11px 18px', fontSize:13, fontWeight:600, cursor:'pointer', borderLeft:`3px solid ${tab===t.key?'var(--green)':'transparent'}`, background:tab===t.key?'var(--green-pale)':'transparent', color:tab===t.key?'var(--green-dark)':'var(--text)', transition:'all .15s' }}>
                  {t.label}
                </div>
              ))}
            </div>
            <button onClick={()=>{logout();navigate('/')}} className="btn btn-danger btn-full btn-ripple hover-lift" style={{ fontSize:13 }}>🚪 Çıkış Yap</button>
          </div>

          {/* Sağ */}
          <div className="anim-trackIn delay-1" style={{ background:'#fff', borderRadius:12, padding:28, border:'1px solid var(--border)', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
            {tab === 'info' && (
              <div>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:22, color:'var(--green-dark)' }}>👤 Kişisel Bilgiler</div>
                <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14 }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Ad Soyad *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">E-posta</label><input className="form-input" value={form.email} disabled style={{ background:'#f5f5f5' }} /></div>
                  <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="0 5XX XXX XX XX" /></div>
                </div>
                <button className="btn btn-primary" style={{ minWidth:160, marginTop:8 }} onClick={saveInfo}>💾 Kaydet</button>
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:22, color:'var(--green-dark)' }}>📦 Siparişlerim</div>
                {orders.length === 0
                  ? <div style={{ textAlign:'center', padding:48, color:'var(--text-muted)' }}>
                      <div style={{ fontSize:48, marginBottom:10 }}>📦</div>
                      <div style={{ fontWeight:600, marginBottom:12 }}>Henüz sipariş vermediniz</div>
                      <Link to="/magaza" className="btn btn-primary">Mağazaya Git →</Link>
                    </div>
                  : <div style={{ display:'grid', gap:14 }}>
                      {orders.map(o=>(
                        <div key={o.id} style={{ background:'var(--gray-bg)', borderRadius:8, padding:18, border:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                            <div>
                              <div style={{ fontWeight:700, fontSize:13 }}>Sipariş #{String(o.id).slice(-8)}</div>
                              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{o.date?.slice(0,10)} · {o.items?.length} ürün</div>
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontSize:12 }}>{orderStatus[o.status]||o.status}</div>
                              <div style={{ fontWeight:900, fontSize:16, color:'var(--green-dark)' }}>{o.total} ₺</div>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                            {o.items?.slice(0,4).map((item,i)=>(
                              <div key={i} style={{ background:'#fff', borderRadius:6, padding:'4px 10px', fontSize:12, border:'1px solid var(--border)' }}>
                                {item.icon} {item.name} × {item.qty}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}

            {tab === 'favs' && (
              <div>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:22, color:'var(--green-dark)' }}>❤️ Favorilerim</div>
                {favProducts.length === 0
                  ? <div style={{ textAlign:'center', padding:48, color:'var(--text-muted)' }}>
                      <div style={{ fontSize:48, marginBottom:10 }}>🤍</div>
                      <div style={{ fontWeight:600, marginBottom:12 }}>Favori listeniz boş</div>
                      <Link to="/magaza" className="btn btn-primary">Mağazaya Git →</Link>
                    </div>
                  : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:14 }}>
                      {favProducts.map(p=>(
                        <div key={p.id} style={{ background:'var(--gray-bg)', borderRadius:8, border:'1px solid var(--border)', overflow:'hidden', cursor:'pointer' }} onClick={()=>navigate(`/magaza/${p.id}`)}>
                          <div style={{ height:120, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40 }}>
                            {p.image ? <img src={p.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span>{p.icon}</span>}
                          </div>
                          <div style={{ padding:'10px 12px' }}>
                            <div style={{ fontSize:13, fontWeight:700, marginBottom:3 }}>{p.name}</div>
                            <div style={{ fontSize:14, fontWeight:900, color:'var(--green-dark)' }}>{p.discountPrice||p.price} ₺</div>
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            )}

            {tab === 'pw' && (
              <div>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:22, color:'var(--green-dark)' }}>🔐 Şifre Değiştir</div>
                <div style={{ maxWidth:380 }}>
                  <div className="form-group"><label className="form-label">Mevcut Şifre</label><input className="form-input" type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Yeni Şifre</label><input className="form-input" type="password" value={pwForm.next} onChange={e=>setPwForm({...pwForm,next:e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Yeni Şifre Tekrar</label><input className="form-input" type="password" value={pwForm.next2} onChange={e=>setPwForm({...pwForm,next2:e.target.value})} /></div>
                  <button className="btn btn-primary" style={{ minWidth:160, marginTop:8 }} onClick={savePassword}>🔐 Şifreyi Güncelle</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
