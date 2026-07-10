import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useShop } from '../context/ShopContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { useIsMobile } from '../hooks/useIsMobile'

function Stars({ rating, size=16 }) {
  return <span style={{ color:'#FF9800', fontSize:size }}>{[1,2,3,4,5].map(i=><span key={i}>{i<=Math.round(rating)?'★':'☆'}</span>)}</span>
}

export default function ProductDetail() {
  const { id } = useParams()
  const { products, getReviews, addReview } = useStore()
  const { addToCart, toggleFav, isFav } = useShop()
  const { currentUser } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const product = products.find(p => p.id === Number(id))
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [reviewForm, setReviewForm] = useState({ rating:5, comment:'' })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const isMobile = useIsMobile()

  if (!product) return <div style={{ padding:60, textAlign:'center', color:'var(--text-muted)' }}>Ürün bulunamadı.</div>

  const images = product.images?.length ? product.images : (product.image ? [product.image] : [])
  const reviews = getReviews(product.id)
  const price = product.discountPrice || product.price
  const discount = product.discountPrice ? Math.round((1-product.discountPrice/product.price)*100) : null
  const fav = isFav(product.id)

  const handleAddCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) { toast('Lütfen beden seçin.', 'error'); return }
    if (product.colors?.length > 0 && !selectedColor) { toast('Lütfen renk seçin.', 'error'); return }
    for (let i = 0; i < qty; i++) addToCart(product, { size: selectedSize, color: selectedColor })
    toast(`${product.name} sepete eklendi 🛒`)
  }

  const handleReview = () => {
    if (!currentUser) { toast('Yorum yapmak için giriş yapmalısınız.', 'error'); return }
    if (!reviewForm.comment.trim()) { toast('Yorum yazın.', 'error'); return }
    addReview(product.id, { ...reviewForm, userName: currentUser.name, userAvatar: currentUser.avatar })
    toast('Yorumunuz eklendi ✓')
    setReviewForm({ rating:5, comment:'' })
    setShowReviewForm(false)
  }

  return (
    <div style={{ background:'var(--gray-bg)', minHeight:'100vh' }}>
      <div style={{ background:'#fff', borderBottom:'1px solid var(--border)', padding:'10px 20px', fontSize:12, color:'var(--text-muted)' }}>
        <span style={{ cursor:'pointer', color:'var(--green)' }} onClick={()=>navigate('/magaza')}>Mağaza</span>
        {' › '}{product.category}{' › '}{product.name}
      </div>

      <div className="page-wrap">
        {/* Ürün ana bölüm */}
        <div className="anim-ballIn hover-glow" style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:36, background:'#fff', borderRadius:10, padding: isMobile ? 16 : 32, border:'1px solid var(--border)', marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,.05)', transition:'box-shadow .3s' }}>
          {/* Görsel */}
          <div className="anim-trackIn">
            <div style={{ height:360, background:images.length?'transparent':'linear-gradient(135deg,var(--green-dark),var(--green-light))', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
              {images.length
                ? <img src={images[activeImg]} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .4s' }} onMouseOver={e=>e.target.style.transform='scale(1.06)'} onMouseOut={e=>e.target.style.transform='scale(1)'} />
                : <span style={{ fontSize:100, animation:'float 3s ease-in-out infinite' }}>{product.icon}</span>
              }
              {discount && <div className="anim-jerseyPop" style={{ position:'absolute', top:14, left:14, background:'#e53935', color:'#fff', fontSize:13, fontWeight:800, padding:'5px 12px', borderRadius:5 }}>-%{discount}</div>}
              <button onClick={()=>toggleFav(product.id)}
                className="hover-scale" style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.9)', border:'none', borderRadius:'50%', width:40, height:40, fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.12)', transition:'transform .15s' }}>
                {fav ? '❤️' : '🤍'}
              </button>
            </div>
            {images.length > 1 && (
              <div style={{ display:'flex', gap:8, marginTop:10, overflowX:'auto', paddingBottom:4 }}>
                {images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width:64, height:64, borderRadius:6, overflow:'hidden', flexShrink:0, cursor:'pointer', border:`2px solid ${activeImg===i?'var(--green)':'var(--border)'}`, transition:'border-color .15s' }}>
                    <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bilgiler */}
          <div className="anim-trackIn delay-1">
            <div style={{ fontSize:11, fontWeight:800, color:'var(--green)', background:'var(--green-pale)', padding:'3px 10px', borderRadius:3, display:'inline-block', marginBottom:10 }}>{product.category}</div>
            <h1 style={{ fontSize:24, fontWeight:900, marginBottom:8, lineHeight:1.2 }}>{product.name}</h1>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Stars rating={product.rating||0} />
              <span style={{ fontSize:13, color:'var(--text-muted)' }}>{product.rating||0} ({product.reviewCount||0} değerlendirme)</span>
            </div>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7, marginBottom:20 }}>{product.desc}</p>

            {/* Fiyat */}
            <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:20 }}>
              <span className="gradient-heading" style={{ fontSize:32, fontWeight:900 }}>{price} ₺</span>
              {discount && <>
                <span style={{ fontSize:18, color:'var(--text-muted)', textDecoration:'line-through' }}>{product.price} ₺</span>
                <span style={{ background:'#e53935', color:'#fff', fontSize:13, fontWeight:800, padding:'3px 10px', borderRadius:4 }}>%{discount} İNDİRİM</span>
              </>}
            </div>

            {/* Beden */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Beden Seçin</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {product.sizes.map(s=>(
                    <button key={s} onClick={()=>setSelectedSize(s)}
                      className="hover-scale" style={{ padding:'7px 16px', borderRadius:5, border:`2px solid ${selectedSize===s?'var(--green)':'var(--border)'}`, background:selectedSize===s?'var(--green-pale)':'#fff', fontWeight:700, fontSize:13, cursor:'pointer', color:selectedSize===s?'var(--green-dark)':'var(--text)', transition:'all .15s' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Renk */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>Renk Seçin</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {product.colors.map(c=>(
                    <button key={c} onClick={()=>setSelectedColor(c)}
                      className="hover-scale" style={{ padding:'7px 16px', borderRadius:5, border:`2px solid ${selectedColor===c?'var(--green)':'var(--border)'}`, background:selectedColor===c?'var(--green-pale)':'#fff', fontWeight:700, fontSize:13, cursor:'pointer', color:selectedColor===c?'var(--green-dark)':'var(--text)', transition:'all .15s' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Miktar */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ fontWeight:700, fontSize:13 }}>Adet:</div>
              <div style={{ display:'flex', alignItems:'center', border:'1.5px solid var(--border)', borderRadius:6, overflow:'hidden' }}>
                <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{ width:36, height:36, background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:18, fontWeight:700 }}>−</button>
                <span style={{ width:40, textAlign:'center', fontWeight:700, fontSize:15 }}>{qty}</span>
                <button onClick={()=>setQty(q=>Math.min(product.stock,q+1))} style={{ width:36, height:36, background:'#f5f5f5', border:'none', cursor:'pointer', fontSize:18, fontWeight:700 }}>+</button>
              </div>
              <span style={{ fontSize:12, color:'var(--text-muted)' }}>Stok: {product.stock}</span>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-primary btn-ripple hover-lift" style={{ flex:1, height:46, fontSize:15 }} onClick={handleAddCart} disabled={product.stock===0}>
                🛒 {product.stock===0?'Stok Tükendi':'Sepete Ekle'}
              </button>
              <button className="btn btn-secondary btn-ripple hover-lift" style={{ height:46, padding:'0 18px' }} onClick={()=>{handleAddCart();navigate('/sepet')}}>
                Hemen Al →
              </button>
            </div>
          </div>
        </div>

        {/* Yorumlar */}
        <div className="anim-trackIn" style={{ background:'#fff', borderRadius:10, padding:28, border:'1px solid var(--border)', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontWeight:900, fontSize:17 }}>💬 Değerlendirmeler ({reviews.length})</div>
            <button className="btn btn-primary btn-sm" onClick={()=>setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'İptal' : '+ Yorum Yap'}
            </button>
          </div>

          {showReviewForm && (
            <div style={{ background:'var(--green-pale)', borderRadius:8, padding:20, marginBottom:20 }}>
              <div className="form-group">
                <label className="form-label">Puanınız</label>
                <div style={{ display:'flex', gap:6 }}>
                  {[1,2,3,4,5].map(i=>(
                    <button key={i} onClick={()=>setReviewForm({...reviewForm,rating:i})}
                      style={{ fontSize:24, background:'none', border:'none', cursor:'pointer', color:i<=reviewForm.rating?'#FF9800':'#ddd', transition:'color .1s' }}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Yorumunuz</label>
                <textarea className="form-input form-textarea" style={{ height:80 }} value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value})} placeholder="Bu ürün hakkında düşüncelerinizi paylaşın..." />
              </div>
              <button className="btn btn-primary" onClick={handleReview}>Yorumu Gönder</button>
            </div>
          )}

          {reviews.length===0
            ? <p style={{ color:'var(--text-muted)', textAlign:'center', padding:30 }}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            : <div style={{ display:'grid', gap:14 }}>
                {reviews.map(r=>(
                  <div key={r.id} className="anim-trackIn hover-lift" style={{ padding:'14px 10px', borderBottom:'1px solid #f0f0f0', borderRadius:8, transition:'background .2s' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <div style={{ width:34, height:34, background:'var(--green-pale)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:'var(--green-dark)', flexShrink:0 }}>{r.userAvatar||r.userName?.slice(0,2)}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:13 }}>{r.userName}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}><Stars rating={r.rating} size={12} /><span style={{ fontSize:11, color:'var(--text-muted)' }}>{r.date}</span></div>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:'var(--text)', lineHeight:1.6, marginLeft:44 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  )
}
