import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, getItemPrice, kongreDiscount } = useShop()
  const { isKongre } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  if (cart.length === 0) return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }} className="anim-jerseyPop">
        <div style={{ fontSize:80, marginBottom:16, animation:'float 3s ease-in-out infinite' }}>🛒</div>
        <h2 style={{ fontWeight:900, marginBottom:8 }}>Sepetiniz Boş</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:24 }}>Mağazadan ürün ekleyerek alışverişe başlayın.</p>
        <button className="btn btn-primary btn-ripple hover-lift" style={{ fontSize:15 }} onClick={() => navigate('/magaza')}>Mağazaya Git →</button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 className="anim-trackIn">🛒 Sepetim</h1>
          <p className="anim-trackIn delay-1">{cart.length} ürün</p>
        </div>
      </div>
      <div className="page-wrap">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>
          {/* Ürünler */}
          <div style={{ display:'grid', gap:14 }}>
            {cart.map((item, i) => (
              <div key={item.key} className="hover-lift anim-trackIn glass-card"
                style={{ animationDelay:`${i*.08}s`, borderRadius:12, padding:16, display:'flex', gap:16, alignItems:'center', border:'1px solid var(--border)' }}>
                <div style={{ width:80, height:80, borderRadius:10, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0, overflow:'hidden' }}>
                  {item.image ? <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : item.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:15 }}>{item.name}</div>
                  {item.selectedSize && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Beden: {item.selectedSize}</div>}
                  {item.selectedColor && <div style={{ fontSize:12, color:'var(--text-muted)' }}>Renk: {item.selectedColor}</div>}
                  <div style={{ color:'var(--green-dark)', fontWeight:900, fontSize:16, marginTop:4 }}>
                    {(item.discountPrice || item.price).toLocaleString('tr-TR')}₺
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <button onClick={() => updateQty(item.key, item.qty - 1)}
                    style={{ width:32, height:32, borderRadius:'50%', border:'1px solid var(--border)', background:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>−</button>
                  <span style={{ fontWeight:800, fontSize:16, minWidth:28, textAlign:'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, item.qty + 1)}
                    style={{ width:32, height:32, borderRadius:'50%', border:'1px solid var(--border)', background:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>+</button>
                </div>
                <div style={{ fontWeight:900, fontSize:16, minWidth:80, textAlign:'right', color:'var(--green-dark)' }}>
                  {(getItemPrice(item) * item.qty).toLocaleString('tr-TR')}₺
                </div>
                <button onClick={() => { removeFromCart(item.key); toast('Ürün sepetten çıkarıldı') }}
                  style={{ background:'#fee2e2', border:'none', borderRadius:'50%', width:32, height:32, fontSize:16, cursor:'pointer', color:'#c00', flexShrink:0 }}>×</button>
              </div>
            ))}
          </div>

          {/* Özet */}
          <div className="glass-card anim-trackIn" style={{ borderRadius:14, padding:24, border:'1px solid var(--border)', position:'sticky', top:20, boxShadow:'0 8px 30px rgba(0,145,58,.1)' }}>
            <h3 style={{ margin:'0 0 20px', fontWeight:900 }}>Sipariş Özeti</h3>
            {isKongre && (
              <div style={{ background:'var(--green-pale)', border:'1px solid var(--green)', borderRadius:8, padding:'8px 12px', marginBottom:14, fontSize:12, color:'var(--green-dark)', fontWeight:700 }}>
                🏛️ Kongre Üyesi — %10 indirim uygulandı!
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:14 }}>
              <span style={{ color:'var(--text-muted)' }}>Ara Toplam</span>
              <span style={{ fontWeight:700 }}>{cartTotal.toLocaleString('tr-TR')}₺</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:14 }}>
              <span style={{ color:'var(--text-muted)' }}>Kargo</span>
              <span style={{ color:'var(--green)', fontWeight:700 }}>Ücretsiz</span>
            </div>
            <div style={{ borderTop:'2px solid var(--green-pale)', paddingTop:16, display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <span style={{ fontWeight:900, fontSize:16 }}>Toplam</span>
              <span style={{ fontWeight:900, fontSize:22, color:'var(--green-dark)' }}>{cartTotal.toLocaleString('tr-TR')}₺</span>
            </div>
            <button className="btn btn-primary btn-full btn-ripple hover-lift anim-scoreboard" style={{ height:50, fontSize:16, fontWeight:800 }}
              onClick={() => navigate('/odeme')}>Ödemeye Geç →</button>
            <button className="btn btn-secondary btn-full" style={{ marginTop:10 }} onClick={() => navigate('/magaza')}>Alışverişe Devam</button>
          </div>
        </div>
      </div>
    </div>
  )
}
