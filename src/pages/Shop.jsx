import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useShop } from '../context/ShopContext'
import { useToast } from '../components/Toast'

const CATS = ['Tümü','Giyim','Ekipman','Aksesuar','Hediyelik']
const SORTS = [
  { key:'default',   label:'Önerilen' },
  { key:'priceAsc',  label:'Fiyat ↑' },
  { key:'priceDesc', label:'Fiyat ↓' },
  { key:'rating',    label:'En Beğenilen' },
]

function Stars({ rating }) {
  return (
    <span style={{ color:'#FF9800', fontSize:11 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5-Math.round(rating))}
    </span>
  )
}

function ProductCard({ product }) {
  const { addToCart, toggleFav, isFav } = useShop()
  const toast = useToast()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const fav = isFav(product.id)
  const price = product.discountPrice || product.price
  const discount = product.discountPrice ? Math.round((1 - product.discountPrice/product.price)*100) : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background:'#fff', borderRadius:10, border:'1px solid var(--border)', overflow:'hidden', transition:'all .2s', position:'relative',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,.12)' : '0 1px 4px rgba(0,0,0,.06)',
        transform: hovered ? 'translateY(-3px)' : 'none', cursor:'pointer' }}>

      {/* Badges */}
      {discount && <div style={{ position:'absolute', top:10, left:10, background:'#e53935', color:'#fff', fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:4, zIndex:3 }}>-%{discount}</div>}
      {product.stock <= 5 && product.stock > 0 && <div style={{ position:'absolute', top:10, left: discount ? 55 : 10, background:'#FF9800', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 7px', borderRadius:4, zIndex:3 }}>Son {product.stock} adet!</div>}
      {product.stock === 0 && <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.75)', zIndex:4, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10 }}><span style={{ background:'#666', color:'#fff', padding:'6px 16px', borderRadius:20, fontWeight:700, fontSize:13 }}>Tükendi</span></div>}

      {/* Favori */}
      <button onClick={e => { e.stopPropagation(); toggleFav(product.id) }}
        style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,.9)', border:'none', borderRadius:'50%', width:34, height:34, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:17, zIndex:3, boxShadow:'0 1px 4px rgba(0,0,0,.12)', transition:'transform .15s' }}
        onMouseOver={e => e.currentTarget.style.transform='scale(1.15)'}
        onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
        {fav ? '❤️' : '🤍'}
      </button>

      {/* Görsel */}
      <div onClick={() => navigate(`/magaza/${product.id}`)}
        style={{ height:200, background: product.image ? 'transparent' : 'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .3s' }} onMouseOver={e => e.target.style.transform='scale(1.05)'} onMouseOut={e => e.target.style.transform='scale(1)'} />
          : <span style={{ fontSize:60 }}>{product.icon}</span>
        }
        {/* Hover overlay - sepete ekle */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(0,0,0,.6)', color:'#fff', textAlign:'center', padding:'10px', fontSize:13, fontWeight:700, transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition:'transform .25s', zIndex:2 }}
          onClick={e => { e.stopPropagation(); if(product.stock > 0) { addToCart(product); toast(`${product.name} sepete eklendi ✓`) } }}>
          {product.stock > 0 ? '🛒 Sepete Ekle' : 'Tükendi'}
        </div>
      </div>

      {/* Bilgi */}
      <div style={{ padding:'12px 14px 14px' }} onClick={() => navigate(`/magaza/${product.id}`)}>
        <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:3 }}>{product.category}</div>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{product.name}</div>

        {/* Puan */}
        <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
          <Stars rating={product.rating || 0} />
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>({product.reviewCount||0})</span>
        </div>

        {/* Fiyat */}
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontSize:18, fontWeight:900, color: discount ? '#e53935' : 'var(--green-dark)' }}>{price}₺</span>
          {discount && <span style={{ fontSize:13, color:'#999', textDecoration:'line-through' }}>{product.price}₺</span>}
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const { products } = useStore()
  const [cat, setCat]     = useState('Tümü')
  const [sort, setSort]   = useState('default')
  const [search, setSearch] = useState('')
  const [onlyDiscount, setOnlyDiscount] = useState(false)
  const [onlyStock, setOnlyStock]       = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (cat !== 'Tümü') list = list.filter(p => p.category === cat)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (onlyDiscount) list = list.filter(p => p.discountPrice)
    if (onlyStock) list = list.filter(p => p.stock > 0)
    if (sort === 'priceAsc')  list.sort((a,b) => (a.discountPrice||a.price) - (b.discountPrice||b.price))
    if (sort === 'priceDesc') list.sort((a,b) => (b.discountPrice||b.price) - (a.discountPrice||a.price))
    if (sort === 'rating')    list.sort((a,b) => (b.rating||0) - (a.rating||0))
    return list
  }, [products, cat, sort, search, onlyDiscount, onlyStock])

  return (
    <div style={{ background:'var(--gray-bg)', minHeight:'100vh' }}>
      <div className="page-header">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:3, marginBottom:8 }}>RESMİ MAĞAZA</div>
          <h1>🛍️ Üsküdar Anadolu Store</h1>
          <p>Resmi ürünlerle kulübünü destekle</p>
        </div>
      </div>
      <div className="page-wrap">

        {/* Arama */}
        <div style={{ marginBottom:18 }}>
          <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Ürün ara..." style={{ maxWidth:400, fontSize:14 }} />
        </div>

        {/* Kategori + Filtreler */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16, alignItems:'center' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'7px 16px', borderRadius:20, border: cat===c ? 'none' : '1px solid var(--border)', background: cat===c ? 'var(--green)' : '#fff', color: cat===c ? '#fff' : 'var(--text)', fontWeight: cat===c ? 700 : 400, fontSize:13, cursor:'pointer', transition:'all .15s' }}>
              {c}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', gap:12, alignItems:'center' }}>
            <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
              <input type="checkbox" checked={onlyDiscount} onChange={e => setOnlyDiscount(e.target.checked)} /> İndirimli
            </label>
            <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, cursor:'pointer' }}>
              <input type="checkbox" checked={onlyStock} onChange={e => setOnlyStock(e.target.checked)} /> Stokta
            </label>
            <select value={sort} onChange={e => setSort(e.target.value)} className="form-input" style={{ fontSize:13, padding:'6px 10px', width:'auto' }}>
              {SORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Sonuç sayısı */}
        <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:16 }}>{filtered.length} ürün listeleniyor</div>

        {/* Grid */}
        {filtered.length === 0
          ? <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}><div style={{ fontSize:48, marginBottom:12 }}>🔍</div><div>Sonuç bulunamadı</div></div>
          : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:18 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
        }
      </div>
    </div>
  )
}
