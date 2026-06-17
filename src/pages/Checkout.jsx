import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Modal from '../components/Modal'

const BACKEND = 'https://uskudar-backend.onrender.com'

// Sandbox test kartları
const TEST_CARDS = [
  { label: '✅ Başarılı', number: '5528790000000008', expiry: '12/30', cvc: '123' },
  { label: '✅ Başarılı 2', number: '4603450000000000', expiry: '12/30', cvc: '123' },
  { label: '❌ Başarısız', number: '5528790000000008', expiry: '12/30', cvc: '111' },
]

export default function Checkout() {
  const { cart, cartTotal, addresses, addAddress, deleteAddress, placeOrder } = useShop()
  const { currentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [addrModal, setAddrModal] = useState(false)
  const [addrForm, setAddrForm] = useState({ title:'', name:'', phone:'', city:'', district:'', address:'' })
  const [card, setCard] = useState({ holderName:'', number:'', expireMonth:'', expireYear:'', cvc:'' })
  const [loading, setLoading] = useState(false)
  const [iyzico3dsHtml, setIyzico3dsHtml] = useState(null)
  const [showTestCards, setShowTestCards] = useState(false)
  const [backendOk, setBackendOk] = useState(null) // null=kontrol ediliyor, true/false

  const shipping  = cartTotal > 500 ? 0 : 49
  const total     = cartTotal + shipping

  // Backend sağlık kontrolü
  useEffect(() => {
    fetch(`${BACKEND}/api/payment/health`, { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false))
  }, [])

  const addr = addresses.find(a => a.id === selectedAddr)

  const handleAddAddress = () => {
    if (!addrForm.title || !addrForm.address || !addrForm.city) { toast('Zorunlu alanları doldurun.','error'); return }
    addAddress(addrForm)
    toast('Adres eklendi ✓')
    setAddrModal(false)
    setAddrForm({ title:'', name:'', phone:'', city:'', district:'', address:'' })
  }

  // Kart ayı/yılını expiry string'den ayır  (MM/YY)
  const parseExpiry = (val) => {
    const [mm, yy] = val.split('/')
    return { month: mm?.trim() || '', year: yy ? '20'+yy.trim() : '' }
  }

  const handlePay = async () => {
    if (!addr) { toast('Adres seçin.','error'); return }
    if (!card.holderName || !card.number || !card.expireMonth || !card.expireYear || !card.cvc) {
      toast('Kart bilgilerini eksiksiz doldurun.','error'); return
    }

    setLoading(true)

    const nameParts = (currentUser?.name || addr.name || 'Müşteri').split(' ')
    const payload = {
      conversationId:  `USK-${Date.now()}`,
      firstName:       nameParts[0],
      lastName:        nameParts.slice(1).join(' ') || nameParts[0],
      email:           currentUser?.email || 'musteri@uskudar.com',
      phone:           currentUser?.phone || addr.phone || '+905000000000',
      identityNumber:  '74300864791', // sandbox TC (gerçekte kullanıcıdan alın)
      address:         `${addr.address}, ${addr.district} / ${addr.city}`,
      city:            addr.city,
      country:         'Turkey',
      cardHolderName:  card.holderName,
      cardNumber:      card.number.replace(/\s/g, ''),
      expireMonth:     card.expireMonth,
      expireYear:      card.expireYear,
      cvc:             card.cvc,
      items:           cart.map(i => ({
        id:       String(i.id),
        name:     i.name,
        category: i.category || 'Spor',
        price:    i.discountPrice || i.price,
        quantity: i.qty,
      })),
    }

    try {
      const res  = await fetch(`${BACKEND}/api/payment/initialize`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.error) {
        toast(`Ödeme hatası: ${data.error}`, 'error')
        setLoading(false)
        return
      }

      // 3DS HTML'i göster
      setIyzico3dsHtml(data.htmlContent)

    } catch (err) {
      toast('Sunucuya bağlanılamadı. Backend çalışıyor mu?', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 3DS iframe'den gelen mesajı dinle
  useEffect(() => {
    const handler = async (e) => {
      if (!e.data?.paymentId) return
      const { paymentId, conversationData, conversationId } = e.data
      try {
        const res  = await fetch(`${BACKEND}/api/payment/complete-3ds`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ paymentId, conversationData, conversationId }),
        })
        const data = await res.json()
        if (data.success) {
          const orderId = placeOrder({ address: addr, total, paymentId: data.paymentId })
          setIyzico3dsHtml(null)
          toast('Ödemeniz alındı, siparişiniz oluşturuldu! ✓')
          navigate('/profil?tab=orders')
        } else {
          toast(`Ödeme tamamlanamadı: ${data.error}`, 'error')
          setIyzico3dsHtml(null)
        }
      } catch {
        toast('3DS tamamlama hatası.', 'error')
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [addr, total])

  // Test kartı seç
  const fillTestCard = (tc) => {
    const { month, year } = parseExpiry(tc.expiry)
    setCard({ holderName:'TEST USER', number:tc.number, expireMonth:month, expireYear:year, cvc:tc.cvc })
    setShowTestCards(false)
    toast('Test kartı dolduruldu')
  }

  if (cart.length === 0) { navigate('/sepet'); return null }

  // 3DS ekranı
  if (iyzico3dsHtml) return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#fff', borderRadius:12, overflow:'hidden', width:'100%', maxWidth:480, position:'relative' }}>
        <div style={{ background:'var(--green-dark)', padding:'14px 20px', color:'#fff', fontWeight:700, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>🔐 3D Secure Doğrulama</span>
          <button onClick={()=>setIyzico3dsHtml(null)} style={{ background:'none', border:'none', color:'#fff', fontSize:22, cursor:'pointer', lineHeight:1 }}>×</button>
        </div>
        <iframe
          srcDoc={iyzico3dsHtml}
          style={{ width:'100%', height:500, border:'none' }}
          title="3D Secure"
          sandbox="allow-scripts allow-forms allow-same-origin allow-top-navigation"
        />
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--gray-bg)', minHeight:'100vh' }}>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }} className="anim-trackIn">GÜVENLİ ÖDEME</div>
          <h1 className="anim-trackIn delay-1">💳 Ödeme</h1>
        </div>
      </div>

      {/* Backend uyarısı */}
      {backendOk === false && (
        <div style={{ background:'#FFF8E1', borderTop:'3px solid #FF9800', padding:'12px 20px', display:'flex', alignItems:'center', gap:12, fontSize:13 }}>
          <span style={{ fontSize:20 }}>⚠️</span>
          <div>
            <strong>Backend çalışmıyor.</strong> Gerçek ödeme için <code>uskudar-backend</code> klasöründe <code>npm install && npm run dev</code> çalıştırın.
            Şu an demo modunda devam edebilirsiniz.
          </div>
        </div>
      )}

      <div className="page-wrap">
        {/* Adım göstergesi */}
        <div className="anim-trackIn" style={{ display:'flex', gap:0, marginBottom:28, background:'#fff', borderRadius:10, padding:'16px 24px', border:'1px solid var(--border)', boxShadow:'0 4px 16px rgba(0,0,0,.05)' }}>
          {[['1','Adres'],['2','Ödeme'],['3','Onay']].map(([n,l],i)=>(
            <div key={n} style={{ display:'flex', alignItems:'center', flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div className={step===Number(n)?'anim-scoreboard':''} style={{ width:30, height:30, borderRadius:'50%', background:step>=Number(n)?'var(--green)':'#e0e0e0', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, transition:'background .3s' }}>{step>Number(n)?'✓':n}</div>
                <span style={{ fontSize:13, fontWeight:step===Number(n)?700:400, color:step>=Number(n)?'var(--green-dark)':'var(--text-muted)' }}>{l}</span>
              </div>
              {i<2 && <div style={{ flex:1, height:2, background:step>Number(n)?'var(--green)':'#e0e0e0', margin:'0 12px', borderRadius:1 }} />}
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:22 }}>
          <div className="anim-trackIn delay-1">
            {/* Adım 1: Adres */}
            {step === 1 && (
              <div>
                <div style={{ fontWeight:800, fontSize:15, color:'var(--green-dark)', marginBottom:14 }}>📍 Teslimat Adresi</div>
                {addresses.length === 0
                  ? <div style={{ background:'#fff', borderRadius:8, padding:32, textAlign:'center', border:'2px dashed var(--border)', marginBottom:14 }}>
                      <div style={{ fontSize:32, marginBottom:8 }}>📭</div>
                      <div style={{ fontWeight:600, color:'var(--text-muted)', marginBottom:12 }}>Kayıtlı adres yok</div>
                      <button className="btn btn-primary btn-ripple hover-lift" onClick={()=>setAddrModal(true)}>+ Adres Ekle</button>
                    </div>
                  : <>
                      <div style={{ display:'grid', gap:12, marginBottom:14 }}>
                        {addresses.map(a=>(
                          <div key={a.id} onClick={()=>setSelectedAddr(a.id)}
                            style={{ background:'#fff', borderRadius:8, padding:16, border:`2px solid ${selectedAddr===a.id?'var(--green)':'var(--border)'}`, cursor:'pointer', transition:'all .15s', position:'relative' }}>
                            <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{a.title}</div>
                            <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.name} · {a.phone}</div>
                            <div style={{ fontSize:13, color:'var(--text-muted)' }}>{a.address}, {a.district} / {a.city}</div>
                            {selectedAddr===a.id && <div style={{ position:'absolute', top:12, right:12, background:'var(--green)', color:'#fff', borderRadius:'50%', width:22, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>✓</div>}
                            <button onClick={e=>{e.stopPropagation();if(confirm('Silinsin mi?'))deleteAddress(a.id)}} style={{ position:'absolute', bottom:12, right:12, background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:12 }}>Sil</button>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-secondary btn-sm" onClick={()=>setAddrModal(true)}>+ Yeni Adres</button>
                    </>
                }
                <div style={{ marginTop:20 }}>
                  <button className="btn btn-primary btn-ripple hover-lift" style={{ minWidth:160, height:44 }}
                    onClick={()=>{ if(!selectedAddr){toast('Adres seçin.','error');return} setStep(2) }}>
                    Devam Et →
                  </button>
                </div>
              </div>
            )}

            {/* Adım 2: Kart */}
            {step === 2 && (
              <div style={{ background:'#fff', borderRadius:8, padding:24, border:'1px solid var(--border)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                  <div style={{ fontWeight:800, fontSize:15, color:'var(--green-dark)' }}>💳 Kart Bilgileri</div>
                  {backendOk === false && (
                    <button onClick={()=>setShowTestCards(!showTestCards)}
                      style={{ background:'#FFF8E1', border:'1px solid #FF9800', color:'#E65100', padding:'5px 12px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                      🧪 Test Kartı
                    </button>
                  )}
                  {backendOk === true && (
                    <button onClick={()=>setShowTestCards(!showTestCards)}
                      style={{ background:'var(--green-pale)', border:'1px solid var(--green)', color:'var(--green-dark)', padding:'5px 12px', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer' }}>
                      🧪 Sandbox Test
                    </button>
                  )}
                </div>

                {showTestCards && (
                  <div style={{ background:'#f9f9f9', borderRadius:8, padding:14, marginBottom:18, border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'var(--text-muted)', marginBottom:10 }}>SANDBOX TEST KARTLARI</div>
                    {TEST_CARDS.map(tc=>(
                      <div key={tc.number+tc.cvc} onClick={()=>fillTestCard(tc)}
                        style={{ display:'grid', gridTemplateColumns:'80px 1fr 80px 50px', gap:8, padding:'8px 10px', borderRadius:6, cursor:'pointer', fontSize:12, marginBottom:6, border:'1px solid var(--border)', background:'#fff', alignItems:'center' }}
                        onMouseOver={e=>e.currentTarget.style.background='var(--green-pale)'}
                        onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                        <span style={{ fontWeight:700 }}>{tc.label}</span>
                        <span style={{ fontFamily:'monospace' }}>{tc.number}</span>
                        <span>{tc.expiry}</span>
                        <span>CVV: {tc.cvc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Kart önizleme */}
                <div style={{ background:'linear-gradient(135deg,var(--green-dark),var(--green))', borderRadius:12, padding:24, marginBottom:22, color:'#fff', fontFamily:'monospace' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                    <div style={{ fontSize:12, opacity:.7 }}>ÜSKÜDAR ANADOLU SK</div>
                    <div style={{ fontSize:18 }}>💳</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:700, letterSpacing:3, marginBottom:16 }}>
                    {card.number ? card.number.replace(/(.{4})/g,'$1 ').trim() : '•••• •••• •••• ••••'}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                    <div><div style={{ opacity:.6, fontSize:10 }}>KART SAHİBİ</div>{card.holderName || 'AD SOYAD'}</div>
                    <div><div style={{ opacity:.6, fontSize:10 }}>SON KULLANMA</div>{(card.expireMonth && card.expireYear) ? `${card.expireMonth}/${card.expireYear.slice(-2)}` : 'MM/YY'}</div>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Kart Üzerindeki Ad Soyad</label>
                    <input className="form-input" value={card.holderName} onChange={e=>setCard({...card,holderName:e.target.value.toUpperCase()})} placeholder="AD SOYAD" />
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Kart Numarası</label>
                    <input className="form-input" value={card.number} style={{ fontFamily:'monospace', letterSpacing:2 }}
                      onChange={e=>{ let v=e.target.value.replace(/\D/g,'').slice(0,16); setCard({...card,number:v}) }}
                      placeholder="0000 0000 0000 0000" maxLength={16} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Son Kullanma Tarihi</label>
                    <input className="form-input" placeholder="MM/YY" maxLength={5}
                      value={card.expireMonth && card.expireYear ? `${card.expireMonth}/${card.expireYear.slice(-2)}` : ''}
                      onChange={e=>{
                        let v = e.target.value.replace(/\D/g,'')
                        if (v.length >= 3) {
                          setCard({...card, expireMonth: v.slice(0,2), expireYear: '20'+v.slice(2,4)})
                        } else {
                          setCard({...card, expireMonth: v, expireYear: ''})
                        }
                      }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" type="password" value={card.cvc}
                      onChange={e=>setCard({...card,cvc:e.target.value.replace(/\D/g,'').slice(0,4)})}
                      placeholder="•••" maxLength={4} />
                  </div>
                </div>

                <div style={{ background:'var(--green-pale)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'var(--green-dark)', marginBottom:16 }}>
                  🔒 Kart bilgileriniz SSL ile şifrelenerek iyzico altyapısı üzerinden işlenir. Bilgileriniz sitemizde saklanmaz.
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setStep(1)}>← Geri</button>
                  <button className="btn btn-primary btn-ripple hover-lift" style={{ flex:1, height:44 }} onClick={()=>setStep(3)}>Devam →</button>
                </div>
              </div>
            )}

            {/* Adım 3: Onay & Ödeme */}
            {step === 3 && (
              <div style={{ background:'#fff', borderRadius:8, padding:24, border:'1px solid var(--border)' }}>
                <div style={{ fontWeight:800, fontSize:15, color:'var(--green-dark)', marginBottom:20 }}>✅ Siparişi Onayla</div>

                <div style={{ display:'grid', gap:12, marginBottom:20 }}>
                  <div style={{ background:'var(--green-pale)', borderRadius:8, padding:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>📍 Teslimat Adresi</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{addr?.title}: {addr?.address}, {addr?.district} / {addr?.city}</div>
                  </div>
                  <div style={{ background:'var(--green-pale)', borderRadius:8, padding:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>💳 Ödeme</div>
                    <div style={{ fontSize:13, color:'var(--text-muted)' }}>{card.holderName} · •••• {card.number.slice(-4)}</div>
                  </div>
                </div>

                <div style={{ display:'grid', gap:8, marginBottom:20 }}>
                  {cart.map(i=>(
                    <div key={i.key} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'8px 0', borderBottom:'1px solid #f5f5f5', alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:18 }}>{i.icon}</span>
                        <span>{i.name} × {i.qty}</span>
                      </div>
                      <span style={{ fontWeight:700 }}>{(i.discountPrice||i.price)*i.qty} ₺</span>
                    </div>
                  ))}
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setStep(2)}>← Geri</button>
                  <button className="btn btn-primary btn-ripple hover-lift" style={{ flex:1, height:48, fontSize:15 }}
                    onClick={backendOk ? handlePay : ()=>{
                      // Backend yoksa demo mod
                      const orderId = placeOrder({ address:addr, total, paymentId:'DEMO-'+Date.now() })
                      toast('Demo mod: Sipariş oluşturuldu ✓')
                      navigate('/profil?tab=orders')
                    }}
                    disabled={loading}>
                    {loading ? '⏳ İşleniyor...' : `🔐 ${total} ₺ Öde${backendOk ? ' (3DS)' : ' (Demo)'}`}
                  </button>
                </div>

                {backendOk === false && (
                  <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:10, textAlign:'center' }}>
                    ⚠️ Backend bağlantısı yok. Demo modunda sipariş oluşturulacak.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Özet */}
          <div style={{ background:'#fff', borderRadius:8, padding:20, border:'1px solid var(--border)', height:'fit-content', position:'sticky', top:90 }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:14, color:'var(--green-dark)' }}>Sipariş Özeti</div>
            {cart.slice(0,5).map(i=>(
              <div key={i.key} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'center' }}>
                <div style={{ width:40, height:40, background:'var(--green-pale)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                  {i.image ? <img src={i.image} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:6 }} /> : i.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{i.name}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>× {i.qty}</div>
                </div>
                <div style={{ fontWeight:700, fontSize:13, flexShrink:0 }}>{(i.discountPrice||i.price)*i.qty} ₺</div>
              </div>
            ))}
            {cart.length > 5 && <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10 }}>+{cart.length-5} ürün daha</div>}
            <div style={{ borderTop:'1px solid #f0f0f0', paddingTop:12, marginTop:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                <span style={{ color:'var(--text-muted)' }}>Ara Toplam</span><span>{cartTotal} ₺</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:10 }}>
                <span style={{ color:'var(--text-muted)' }}>Kargo</span>
                <span style={{ color:shipping===0?'var(--green)':'inherit', fontWeight:shipping===0?700:400 }}>{shipping===0?'Ücretsiz':shipping+' ₺'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:900, fontSize:18 }}>
                <span>Toplam</span><span style={{ color:'var(--green-dark)' }}>{total} ₺</span>
              </div>
            </div>
            <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>
              <span style={{ fontSize:12 }}>🔒</span>
              <span style={{ fontSize:11, color:'var(--text-muted)' }}>iyzico güvencesiyle ödeme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Adres modal */}
      {addrModal && (
        <Modal title="Yeni Adres Ekle" onClose={()=>setAddrModal(false)}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Adres Başlığı *</label><input className="form-input" value={addrForm.title} onChange={e=>setAddrForm({...addrForm,title:e.target.value})} placeholder="Ev, İş..." /></div>
            <div className="form-group"><label className="form-label">Ad Soyad</label><input className="form-input" value={addrForm.name} onChange={e=>setAddrForm({...addrForm,name:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">Telefon</label><input className="form-input" value={addrForm.phone} onChange={e=>setAddrForm({...addrForm,phone:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">İl *</label><input className="form-input" value={addrForm.city} onChange={e=>setAddrForm({...addrForm,city:e.target.value})} /></div>
            <div className="form-group"><label className="form-label">İlçe</label><input className="form-input" value={addrForm.district} onChange={e=>setAddrForm({...addrForm,district:e.target.value})} /></div>
            <div className="form-group" style={{ gridColumn:'1/-1' }}><label className="form-label">Açık Adres *</label><textarea className="form-input form-textarea" style={{ height:80 }} value={addrForm.address} onChange={e=>setAddrForm({...addrForm,address:e.target.value})} /></div>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-primary btn-ripple hover-lift" style={{ flex:1 }} onClick={handleAddAddress}>Kaydet</button>
            <button className="btn" style={{ background:'#f0f0f0' }} onClick={()=>setAddrModal(false)}>İptal</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
