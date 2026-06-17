import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useSite } from '../context/SiteContext'
import { useToast } from '../components/Toast'

const TABS = [
  { id: 'news',     label: '📰 Haberler' },
  { id: 'fixtures', label: '📅 Fikstür' },
  { id: 'products', label: '🛍️ Ürünler' },
  { id: 'players',  label: '👥 Kadro' },
  { id: 'members',  label: '📋 Üyeler' },
  { id: 'site',     label: '⚙️ Site Ayarları' },
]

const BRANCHES = ['Futbol','Basketbol','Voleybol','Masa Tenisi']
const POS_FOOTBALL = ['Kaleci','Defans','Orta Saha','Forvet']
const POS_BASKETBALL = ['Pivot','Center','Forward','Guard','Point Guard']
const PRODUCT_CATS = ['Giyim','Aksesuar','Ekipman','Hediyelik']

function resizeImage(file, maxW = 800, maxH = 600, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

function ImageUpload({ value, onChange, label = 'Fotoğraf Ekle', square = false }) {
  const ref = useRef()
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const compressed = await resizeImage(file)
    onChange(compressed)
  }
  const h = value ? (square ? 120 : 160) : 80
  return (
    <div>
      <div onClick={() => ref.current.click()}
        style={{ width: square ? 120 : '100%', height: h, border: '2px dashed var(--border)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#fafafa', position: 'relative', transition: 'border-color .2s' }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--green)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
        {value
          ? <img src={value} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 12, marginTop: 4 }}>{label}</div></div>
        }
        {value && (
          <div onClick={e => { e.stopPropagation(); onChange(null) }}
            style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.55)', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' }}>×</div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

// ── HABERLER ─────────────────────────────────────────────────────────────────
function MultiImageUpload({ images = [], onChange }) {
  const ref = useRef()
  const handleFile = async (e) => {
    const files = Array.from(e.target.files)
    const results = await Promise.all(files.map(f => resizeImage(f)))
    onChange([...images, ...results])
    e.target.value = ''
  }
  return (
    <div>
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:8 }}>
        {images.map((img, i) => (
          <div key={i} style={{ position:'relative', width:100, height:80 }}>
            <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:6, border:'1px solid var(--border)' }} />
            <button onClick={() => onChange(images.filter((_,j) => j !== i))}
              style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,.6)', color:'#fff', border:'none', borderRadius:'50%', width:20, height:20, fontSize:12, cursor:'pointer', lineHeight:1 }}>×</button>
            {i === 0 && <div style={{ position:'absolute', bottom:2, left:2, background:'var(--green)', color:'#fff', fontSize:9, padding:'1px 5px', borderRadius:3, fontWeight:700 }}>ANA</div>}
          </div>
        ))}
        <div onClick={() => ref.current.click()}
          style={{ width:100, height:80, border:'2px dashed var(--border)', borderRadius:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-muted)', fontSize:11, gap:4, transition:'border-color .2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor='var(--green)'}
          onMouseOut={e => e.currentTarget.style.borderColor='var(--border)'}>
          <span style={{ fontSize:22 }}>📷</span>
          <span>Görsel Ekle</span>
        </div>
      </div>
      <div style={{ fontSize:11, color:'var(--text-muted)' }}>İlk görsel ana fotoğraf olarak kullanılır. Birden fazla seçebilirsiniz.</div>
      <input ref={ref} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFile} />
    </div>
  )
}

function NewsTab() {
  const { news, addNews, updateNews, deleteNews } = useStore()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const empty = { title: '', category: 'Futbol', icon: '📰', date: new Date().toISOString().slice(0,10), content: '', images: [], published: true }
  const [form, setForm] = useState(empty)

  const openNew  = () => { setForm(empty); setEditing('new') }
  const openEdit = (item) => {
    // Eski 'image' alanını 'images' dizisine dönüştür
    const images = item.images || (item.image ? [item.image] : [])
    setForm({ ...item, images })
    setEditing(item.id)
  }
  const cancel   = () => { setEditing(null) }

  const save = () => {
    if (!form.title.trim()) { toast('Başlık zorunlu', 'error'); return }
    const data = { ...form, image: form.images?.[0] || null }
    if (editing === 'new') addNews(data); else updateNews(editing, data)
    toast(editing === 'new' ? 'Haber eklendi ✓' : 'Güncellendi ✓')
    cancel()
  }

  if (editing !== null) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={cancel} className="btn" style={{ background:'#f0f0f0' }}>← Geri</button>
        <h3 style={{ margin:0 }}>{editing === 'new' ? 'Yeni Haber' : 'Haberi Düzenle'}</h3>
      </div>
      <div style={{ display:'grid', gap:14 }}>
        <div>
          <div style={{ fontWeight:600, fontSize:13, marginBottom:8 }}>📷 Görseller (çoklu)</div>
          <MultiImageUpload images={form.images || []} onChange={imgs => setForm(f => ({ ...f, images: imgs }))} />
        </div>
        <div className="form-group"><label className="form-label">Başlık *</label><input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 80px 140px', gap:12 }}>
          <div className="form-group"><label className="form-label">Kategori</label>
            <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}>
              {[...BRANCHES,'Genel'].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Tarih</label><input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">İkon</label><input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon:e.target.value }))} /></div>
          <div className="form-group" style={{ alignSelf:'end' }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', height:42 }}>
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published:e.target.checked }))} /> Yayında
            </label>
          </div>
        </div>
        <div className="form-group"><label className="form-label">İçerik</label><textarea className="form-input form-textarea" style={{ height:120 }} value={form.content} onChange={e => setForm(f => ({ ...f, content:e.target.value }))} /></div>
        <button className="btn btn-primary" onClick={save}>Kaydet</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ margin:0 }}>Haberler ({news.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Yeni Haber</button>
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {news.map(item => (
          <div key={item.id} style={{ display:'flex', gap:12, alignItems:'center', background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:12 }}>
            <div style={{ width:56, height:56, borderRadius:6, overflow:'hidden', flexShrink:0, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
              {item.image ? <img src={item.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : item.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{item.category} · {item.date} · {item.published ? '🟢 Yayında' : '🔴 Gizli'}</div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>Düzenle</button>
              <button className="btn btn-sm" style={{ background:'#fee', color:'#c00' }} onClick={() => { if(confirm('Silinsin mi?')) { deleteNews(item.id); toast('Silindi') } }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ÜRÜNLER ───────────────────────────────────────────────────────────────────
function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const empty = { name:'', desc:'', icon:'📦', price:'', discountPrice:'', stock:'', category:'Giyim', image:null, sizes:[], colors:[] }
  const [form, setForm] = useState(empty)
  const [sizesInput, setSizesInput] = useState('')
  const [colorsInput, setColorsInput] = useState('')

  const openNew  = () => { setForm(empty); setSizesInput(''); setColorsInput(''); setEditing('new') }
  const openEdit = (item) => { setForm({ ...item }); setSizesInput(item.sizes?.join(',') || ''); setColorsInput(item.colors?.join(',') || ''); setEditing(item.id) }
  const cancel   = () => setEditing(null)

  const save = () => {
    if (!form.name.trim() || !form.price) { toast('İsim ve fiyat zorunlu', 'error'); return }
    const data = { ...form, price: parseFloat(form.price), discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null, stock: parseInt(form.stock) || 0, sizes: sizesInput.split(',').map(s => s.trim()).filter(Boolean), colors: colorsInput.split(',').map(s => s.trim()).filter(Boolean) }
    if (editing === 'new') addProduct(data); else updateProduct(editing, data)
    toast(editing === 'new' ? 'Ürün eklendi ✓' : 'Güncellendi ✓')
    cancel()
  }

  if (editing !== null) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={cancel} className="btn" style={{ background:'#f0f0f0' }}>← Geri</button>
        <h3 style={{ margin:0 }}>{editing === 'new' ? 'Yeni Ürün' : 'Ürünü Düzenle'}</h3>
      </div>
      <div style={{ display:'grid', gap:14 }}>
        <ImageUpload value={form.image} onChange={v => setForm(f => ({ ...f, image:v }))} label="Ürün Fotoğrafı (maks 3MB)" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 80px', gap:12 }}>
          <div className="form-group"><label className="form-label">Ürün Adı *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">İkon</label><input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon:e.target.value }))} /></div>
        </div>
        <div className="form-group"><label className="form-label">Açıklama</label><textarea className="form-input form-textarea" style={{ height:70 }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc:e.target.value }))} /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
          <div className="form-group"><label className="form-label">Fiyat ₺ *</label><input type="number" className="form-input" value={form.price} onChange={e => setForm(f => ({ ...f, price:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">İndirimli ₺</label><input type="number" className="form-input" value={form.discountPrice || ''} onChange={e => setForm(f => ({ ...f, discountPrice:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Stok</label><input type="number" className="form-input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Kategori</label>
            <select className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}>
              {PRODUCT_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group"><label className="form-label">Bedenler (virgülle)</label><input className="form-input" value={sizesInput} onChange={e => setSizesInput(e.target.value)} placeholder="S,M,L,XL" /></div>
          <div className="form-group"><label className="form-label">Renkler (virgülle)</label><input className="form-input" value={colorsInput} onChange={e => setColorsInput(e.target.value)} placeholder="Yeşil,Beyaz" /></div>
        </div>
        <button className="btn btn-primary" onClick={save}>Kaydet</button>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ margin:0 }}>Ürünler ({products.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={openNew}>+ Yeni Ürün</button>
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {products.map(item => (
          <div key={item.id} style={{ display:'flex', gap:12, alignItems:'center', background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:12 }}>
            <div style={{ width:56, height:56, borderRadius:6, overflow:'hidden', flexShrink:0, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
              {item.image ? <img src={item.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : item.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{item.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                {item.discountPrice ? <><span style={{ color:'var(--green)', fontWeight:700 }}>{item.discountPrice}₺</span> <span style={{ textDecoration:'line-through' }}>{item.price}₺</span></> : <span>{item.price}₺</span>} · Stok:{item.stock} · {item.category}
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>Düzenle</button>
              <button className="btn btn-sm" style={{ background:'#fee', color:'#c00' }} onClick={() => { if(confirm('Silinsin mi?')) { deleteProduct(item.id); toast('Silindi') } }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── OYUNCU KADROLARI ─────────────────────────────────────────────────────────
function PlayersTab() {
  const { players, addTeam, updateTeam, deleteTeam, addPlayer, updatePlayer, deletePlayer } = useStore()
  const toast = useToast()
  const [view, setView] = useState('teams')
  const [teamForm, setTeamForm] = useState({ branch:'Futbol', team:'' })
  const [playerForm, setPlayerForm] = useState({ name:'', number:'', position:'', age:'', image:null, bio:'', birthYear:'', nationality:'', height:'', weight:'', foot:'', achievements:[] })
  const [activeTeamId, setActiveTeamId] = useState(null)
  const [activePlayerId, setActivePlayerId] = useState(null)

  const activeTeam = players.find(t => t.id === activeTeamId)

  const saveTeam = () => {
    if (!teamForm.team.trim()) { toast('Takım adı zorunlu','error'); return }
    if (view === 'newteam') addTeam(teamForm); else updateTeam(activeTeamId, teamForm)
    toast('Kaydedildi ✓'); setView('teams')
  }

  const savePlayer = () => {
    if (!playerForm.name.trim()) { toast('İsim zorunlu','error'); return }
    const data = { ...playerForm, number:parseInt(playerForm.number)||0, age:parseInt(playerForm.age)||0 }
    if (view === 'newplayer') addPlayer(activeTeamId, data); else updatePlayer(activeTeamId, activePlayerId, data)
    toast('Kaydedildi ✓'); setView('teamdetail')
  }

  if (view === 'teams') return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <h3 style={{ margin:0 }}>Takımlar ({players.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => { setTeamForm({ branch:'Futbol', team:'' }); setView('newteam') }}>+ Yeni Takım</button>
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {players.map(t => (
          <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', background:'#fff', border:'1px solid var(--border)', borderRadius:8, padding:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700 }}>{t.team}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)' }}>{t.branch} · {t.players?.length||0} oyuncu</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setActiveTeamId(t.id); setView('teamdetail') }}>Kadroyu Gör</button>
              <button className="btn btn-secondary btn-sm" onClick={() => { setActiveTeamId(t.id); setTeamForm({ branch:t.branch, team:t.team }); setView('editteam') }}>Düzenle</button>
              <button className="btn btn-sm" style={{ background:'#fee', color:'#c00' }} onClick={() => { if(confirm('Takım ve tüm oyuncular silinecek?')) { deleteTeam(t.id); toast('Silindi') } }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (view === 'newteam' || view === 'editteam') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => setView('teams')} className="btn" style={{ background:'#f0f0f0' }}>← Geri</button>
        <h3 style={{ margin:0 }}>{view === 'newteam' ? 'Yeni Takım' : 'Takımı Düzenle'}</h3>
      </div>
      <div style={{ display:'grid', gap:14, maxWidth:400 }}>
        <div className="form-group"><label className="form-label">Branş</label>
          <select className="form-input" value={teamForm.branch} onChange={e => setTeamForm(f => ({ ...f, branch:e.target.value }))}>
            {BRANCHES.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Takım Adı *</label><input className="form-input" value={teamForm.team} onChange={e => setTeamForm(f => ({ ...f, team:e.target.value }))} placeholder="A Takım, Kadın Takım..." /></div>
        <button className="btn btn-primary" onClick={saveTeam}>Kaydet</button>
      </div>
    </div>
  )

  if (view === 'teamdetail' && activeTeam) return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => setView('teams')} className="btn" style={{ background:'#f0f0f0' }}>← Takımlar</button>
        <h3 style={{ margin:0 }}>{activeTeam.team} — {activeTeam.branch}</h3>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => { setPlayerForm({ name:'', number:'', position:'', age:'', image:null }); setView('newplayer') }}>+ Oyuncu Ekle</button>
      </div>
      {(!activeTeam.players || activeTeam.players.length === 0) && <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}>Henüz oyuncu yok. "Oyuncu Ekle" butonuna tıklayın.</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
        {activeTeam.players?.map(pl => (
          <div key={pl.id} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <div style={{ height:100, background:'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              {pl.image ? <img src={pl.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <div style={{ fontSize:44 }}>👤</div>}
              <div style={{ position:'absolute', top:6, left:6, background:'var(--green)', color:'#fff', borderRadius:5, padding:'2px 7px', fontWeight:900, fontSize:13 }}>#{pl.number}</div>
            </div>
            <div style={{ padding:'10px 10px 12px', textAlign:'center' }}>
              <div style={{ fontWeight:700, fontSize:13 }}>{pl.name}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8 }}>{pl.position}{pl.age ? ` · ${pl.age} yaş` : ''}</div>
              <div style={{ display:'flex', gap:6, justifyContent:'center' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => { setActivePlayerId(pl.id); setPlayerForm({ bio:'', birthYear:'', nationality:'', height:'', weight:'', foot:'', achievements:[], ...pl }); setView('editplayer') }}>Düzenle</button>
                <button className="btn btn-sm" style={{ background:'#fee', color:'#c00' }} onClick={() => { if(confirm('Silinsin mi?')) { deletePlayer(activeTeamId, pl.id); toast('Silindi') } }}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  if (view === 'newplayer' || view === 'editplayer') return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={() => setView('teamdetail')} className="btn" style={{ background:'#f0f0f0' }}>← Geri</button>
        <h3 style={{ margin:0 }}>{view === 'newplayer' ? 'Yeni Oyuncu' : 'Oyuncuyu Düzenle'}</h3>
      </div>
      <div style={{ display:'grid', gap:14, maxWidth:560 }}>
        <ImageUpload value={playerForm.image} onChange={v => setPlayerForm(f => ({ ...f, image:v }))} label="Oyuncu Fotoğrafı" square />
        <div className="form-group"><label className="form-label">Ad Soyad *</label><input className="form-input" value={playerForm.name} onChange={e => setPlayerForm(f => ({ ...f, name:e.target.value }))} /></div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div className="form-group"><label className="form-label">Forma No</label><input type="number" className="form-input" value={playerForm.number} onChange={e => setPlayerForm(f => ({ ...f, number:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Yaş</label><input type="number" className="form-input" value={playerForm.age} onChange={e => setPlayerForm(f => ({ ...f, age:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Pozisyon</label>
            <select className="form-input" value={playerForm.position} onChange={e => setPlayerForm(f => ({ ...f, position:e.target.value }))}>
              <option value="">Seç...</option>
              {(activeTeam?.branch === 'Basketbol' ? POS_BASKETBALL : POS_FOOTBALL).map(p => <option key={p}>{p}</option>)}
              <option>Diğer</option>
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div className="form-group"><label className="form-label">Doğum Yılı</label><input className="form-input" value={playerForm.birthYear||''} onChange={e => setPlayerForm(f => ({ ...f, birthYear:e.target.value }))} placeholder="1998" /></div>
          <div className="form-group"><label className="form-label">Uyruk</label><input className="form-input" value={playerForm.nationality||''} onChange={e => setPlayerForm(f => ({ ...f, nationality:e.target.value }))} placeholder="Türk" /></div>
          <div className="form-group"><label className="form-label">Tercih Ayak</label>
            <select className="form-input" value={playerForm.foot||''} onChange={e => setPlayerForm(f => ({ ...f, foot:e.target.value }))}>
              <option value="">—</option><option>Sağ</option><option>Sol</option><option>Her İkisi</option>
            </select>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group"><label className="form-label">Boy (cm)</label><input type="number" className="form-input" value={playerForm.height||''} onChange={e => setPlayerForm(f => ({ ...f, height:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Kilo (kg)</label><input type="number" className="form-input" value={playerForm.weight||''} onChange={e => setPlayerForm(f => ({ ...f, weight:e.target.value }))} /></div>
        </div>
        <div className="form-group">
          <label className="form-label">Biyografi</label>
          <textarea className="form-input form-textarea" style={{ height:100 }} value={playerForm.bio||''} onChange={e => setPlayerForm(f => ({ ...f, bio:e.target.value }))} placeholder="Oyuncu hakkında kısa bilgi..." />
        </div>
        <div>
          <label className="form-label">Başarılar</label>
          {(playerForm.achievements||[]).map((a, i) => (
            <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
              <input className="form-input" style={{ padding:'6px 10px', fontSize:12, flex:1 }} value={a} onChange={e => setPlayerForm(f => ({ ...f, achievements: f.achievements.map((x,j) => j===i ? e.target.value : x) }))} />
              <button onClick={() => setPlayerForm(f => ({ ...f, achievements: f.achievements.filter((_,j) => j!==i) }))} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'4px 10px', color:'#c00', cursor:'pointer', fontWeight:700 }}>×</button>
            </div>
          ))}
          <button onClick={() => setPlayerForm(f => ({ ...f, achievements: [...(f.achievements||[]), ''] }))} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'4px 12px', cursor:'pointer', fontWeight:700 }}>+ Başarı Ekle</button>
        </div>
        <button className="btn btn-primary" onClick={savePlayer}>Kaydet</button>
      </div>
    </div>
  )

  return null
}

// ── ÜYELER ───────────────────────────────────────────────────────────────────
function MembersTab() {
  const { members, updateMember, deleteMember } = useStore()
  const { users, setKongreMember } = useAuth()
  const toast = useToast()
  const statusLabel = { active:'🟢 Aktif', pending:'🟡 Bekliyor', inactive:'🔴 Pasif' }

  const getAuthUser = (m) => users.find(u => u.email === m.email)

  return (
    <div>
      <h3 style={{ margin:'0 0 16px' }}>Üyeler ({members.length})</h3>
      <div style={{ background:'var(--green-pale)', border:'1px solid var(--green)', borderRadius:10, padding:'10px 16px', marginBottom:16, fontSize:13, color:'var(--green-dark)' }}>
        🏛️ <strong>Kongre Üyesi</strong> atanan kullanıcılar mağazada <strong>%10 indirim</strong> kazanır.
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {members.map(m => {
          const authUser = getAuthUser(m)
          const isKongre = authUser?.role === 'kongre'
          return (
            <div key={m.id} style={{ display:'flex', gap:12, alignItems:'center', background:'#fff', border:`1px solid ${isKongre ? 'var(--green)' : 'var(--border)'}`, borderRadius:8, padding:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background: isKongre ? 'var(--green)' : 'var(--green-pale)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color: isKongre ? '#fff' : 'var(--green-dark)', flexShrink:0 }}>
                {m.name.substring(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:8 }}>
                  {m.name}
                  {isKongre && <span style={{ fontSize:10, background:'var(--green)', color:'#fff', padding:'2px 8px', borderRadius:20, fontWeight:800 }}>🏛️ KONGRE ÜYESİ</span>}
                </div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>{m.email} · {m.branch} · {statusLabel[m.status]||m.status}</div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                {authUser && (
                  <button className="btn btn-sm" style={{ background: isKongre ? '#fff3cd' : 'var(--green-pale)', color: isKongre ? '#856404' : 'var(--green-dark)', border: `1px solid ${isKongre ? '#ffc107' : 'var(--green)'}`, fontSize:11 }}
                    onClick={() => { setKongreMember(authUser.id, !isKongre); toast(isKongre ? 'Kongre üyeliği kaldırıldı' : '🏛️ Kongre üyesi yapıldı') }}>
                    {isKongre ? '🏛️ Kongre Kaldır' : '🏛️ Kongre Yap'}
                  </button>
                )}
                <select className="form-input" style={{ fontSize:12, padding:'4px 8px', height:32 }} value={m.status} onChange={e => { updateMember(m.id,{status:e.target.value}); toast('Durum güncellendi') }}>
                  <option value="active">Aktif</option>
                  <option value="pending">Bekliyor</option>
                  <option value="inactive">Pasif</option>
                </select>
                <button className="btn btn-sm" style={{ background:'#fee', color:'#c00' }} onClick={() => { if(confirm('Silinsin mi?')) { deleteMember(m.id); toast('Silindi') } }}>Sil</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── SİTE AYARLARI ────────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', padding:'14px 18px', background: open ? 'var(--green)' : '#f8f9fa', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', fontWeight:700, fontSize:14, color: open ? '#fff' : 'var(--text)' }}>
        <span>{title}</span>
        <span style={{ fontSize:18 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div style={{ padding:'20px 18px', display:'grid', gap:14 }}>{children}</div>}
    </div>
  )
}

function SiteTab() {
  const { settings, updateSettings, updateBranch, updateAbout } = useSite()
  const { contact, updateContact } = useStore()
  const toast = useToast()

  // ── Temel bilgiler
  const [basic, setBasic] = useState({
    clubName: settings.clubName, clubShort: settings.clubShort,
    clubSub: settings.clubSub, slogan: settings.slogan,
    footerAbout: settings.footerAbout, logo: settings.logo,
    colorGreen: settings.colorGreen, colorDark: settings.colorDark, colorLight: settings.colorLight,
  })

  // ── Slider
  const [slides, setSlides] = useState(settings.slides)
  const setSlideField = (i, field, val) => setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  const addSlide = () => setSlides(prev => [...prev, { tag: 'Genel', title: 'Yeni Slayt', sub: '', btn: 'Devamını Oku', image: null }])
  const removeSlide = (i) => setSlides(prev => prev.filter((_, idx) => idx !== i))

  // ── İstatistikler
  const [stats, setStats] = useState(settings.stats)
  const setStat = (i, field, val) => setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  // ── Ticker
  const [ticker, setTicker] = useState((settings.tickerItems || []).join('\n'))

  // ── İletişim
  const [ctc, setCtc] = useState({ ...contact })

  // ── Branşlar
  const BRANCH_IDS = ['futbol','basketbol','voleybol','masatenisi']
  const BRANCH_NAMES = { futbol:'Futbol', basketbol:'Basketbol', voleybol:'Voleybol', masatenisi:'Masa Tenisi' }
  const [branches, setBranches] = useState(() => {
    const b = {}
    BRANCH_IDS.forEach(id => { b[id] = { ...(settings.branches?.[id] || {}), achievements: [...(settings.branches?.[id]?.achievements || [])], teams: [...(settings.branches?.[id]?.teams || [])] } })
    return b
  })
  const setBranchField = (id, field, val) => setBranches(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  const setBranchListItem = (id, field, i, val) => setBranches(prev => ({ ...prev, [id]: { ...prev[id], [field]: prev[id][field].map((x, j) => j === i ? val : x) } }))
  const addBranchListItem = (id, field) => setBranches(prev => ({ ...prev, [id]: { ...prev[id], [field]: [...(prev[id][field] || []), ''] } }))
  const removeBranchListItem = (id, field, i) => setBranches(prev => ({ ...prev, [id]: { ...prev[id], [field]: prev[id][field].filter((_, j) => j !== i) } }))

  // ── Hakkımızda
  const [about, setAbout] = useState({ ...settings.about })
  const setAboutField = (field, val) => setAbout(prev => ({ ...prev, [field]: val }))
  // Milestones
  const setMilestone = (i, field, val) => setAbout(prev => ({ ...prev, milestones: prev.milestones.map((m, j) => j === i ? { ...m, [field]: val } : m) }))
  const addMilestone = () => setAbout(prev => ({ ...prev, milestones: [...prev.milestones, { year: '', title: '', desc: '' }] }))
  const removeMilestone = (i) => setAbout(prev => ({ ...prev, milestones: prev.milestones.filter((_, j) => j !== i) }))
  // Values
  const setValue = (i, field, val) => setAbout(prev => ({ ...prev, values: prev.values.map((v, j) => j === i ? { ...v, [field]: val } : v) }))
  const addValue = () => setAbout(prev => ({ ...prev, values: [...prev.values, { icon: '⭐', title: '', desc: '' }] }))
  const removeValue = (i) => setAbout(prev => ({ ...prev, values: prev.values.filter((_, j) => j !== i) }))
  // Board
  const setBoard = (i, field, val) => setAbout(prev => ({ ...prev, board: prev.board.map((b, j) => j === i ? { ...b, [field]: val } : b) }))
  const addBoard = () => setAbout(prev => ({ ...prev, board: [...prev.board, { name: '', title: '', icon: '👤', image: null }] }))
  const removeBoard = (i) => setAbout(prev => ({ ...prev, board: prev.board.filter((_, j) => j !== i) }))

  const saveAll = () => {
    updateSettings({ ...basic, slides, stats, tickerItems: ticker.split('\n').map(s => s.trim()).filter(Boolean) })
    updateContact(ctc)
    BRANCH_IDS.forEach(id => updateBranch(id, branches[id]))
    updateAbout(about)
    toast('Tüm ayarlar kaydedildi ✓')
  }

  const inputSm = { padding:'6px 10px', fontSize:12 }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h3 style={{ margin:0 }}>⚙️ Site Ayarları</h3>
        <button className="btn btn-primary" onClick={saveAll}>💾 Tümünü Kaydet</button>
      </div>

      {/* 1 — Temel Bilgiler */}
      <Section title="🏷️ Temel Bilgiler" defaultOpen>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div className="form-group" style={{ gridColumn:'span 2' }}>
            <label className="form-label">🖼️ Kulüp Logosu</label>
            <ImageUpload value={basic.logo} onChange={v => setBasic(f => ({ ...f, logo:v }))} label="Logo Yükle" square />
          </div>
          <div className="form-group"><label className="form-label">Kulüp Tam Adı</label><input className="form-input" value={basic.clubName} onChange={e => setBasic(f => ({ ...f, clubName:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Kısa Ad (navbar)</label><input className="form-input" value={basic.clubShort} onChange={e => setBasic(f => ({ ...f, clubShort:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Alt Başlık (navbar)</label><input className="form-input" value={basic.clubSub} onChange={e => setBasic(f => ({ ...f, clubSub:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">Slogan</label><input className="form-input" value={basic.slogan} onChange={e => setBasic(f => ({ ...f, slogan:e.target.value }))} /></div>
          <div className="form-group" style={{ gridColumn:'span 2' }}><label className="form-label">Footer Açıklaması</label><textarea className="form-input form-textarea" style={{ height:80 }} value={basic.footerAbout} onChange={e => setBasic(f => ({ ...f, footerAbout:e.target.value }))} /></div>
        </div>
        <div>
          <label className="form-label">🎨 Renk Teması</label>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginTop:8 }}>
            {[['Ana Yeşil','colorGreen'],['Koyu Yeşil','colorDark'],['Açık Yeşil','colorLight']].map(([lbl, key]) => (
              <div key={key} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <input type="color" value={basic[key]} onChange={e => setBasic(f => ({ ...f, [key]:e.target.value }))} style={{ width:36, height:36, border:'none', borderRadius:6, cursor:'pointer', padding:2 }} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 2 — Slider */}
      <Section title="🎠 Ana Sayfa Slider">
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>Resim eklenmezse animasyonlu yeşil arka plan gösterilir.</div>
        {slides.map((s, i) => (
          <div key={i} style={{ border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', background:'#fafafa' }}>
            <div style={{ position:'relative', height: s.image ? 160 : 80, background:'linear-gradient(135deg,var(--green-dark),var(--green))', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', cursor:'pointer' }}
              onClick={() => document.getElementById(`slide-upload-${i}`).click()}>
              {s.image ? <img src={s.image} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ textAlign:'center', color:'rgba(255,255,255,.7)' }}><div style={{ fontSize:24 }}>📷</div><div style={{ fontSize:11 }}>Resim Ekle</div></div>}
              {s.image && <button onClick={e => { e.stopPropagation(); setSlideField(i,'image',null) }} style={{ position:'absolute', top:6, right:6, background:'rgba(0,0,0,.6)', color:'#fff', border:'none', borderRadius:'50%', width:24, height:24, fontSize:13, cursor:'pointer' }}>×</button>}
              <input id={`slide-upload-${i}`} type="file" accept="image/*" style={{ display:'none' }}
                onChange={async e => { const file = e.target.files[0]; if (!file) return; const c = await resizeImage(file,1200,800,.8); setSlideField(i,'image',c); e.target.value='' }} />
            </div>
            <div style={{ padding:'10px 12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div><div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:2 }}>ETİKET</div><input className="form-input" style={inputSm} value={s.tag} onChange={e => setSlideField(i,'tag',e.target.value)} /></div>
              <div><div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:2 }}>BUTON</div><input className="form-input" style={inputSm} value={s.btn} onChange={e => setSlideField(i,'btn',e.target.value)} /></div>
              <div style={{ gridColumn:'span 2' }}><div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:2 }}>BAŞLIK</div><input className="form-input" style={inputSm} value={s.title} onChange={e => setSlideField(i,'title',e.target.value)} /></div>
              <div style={{ gridColumn:'span 2' }}><div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600, marginBottom:2 }}>ALT BAŞLIK</div><input className="form-input" style={inputSm} value={s.sub} onChange={e => setSlideField(i,'sub',e.target.value)} /></div>
            </div>
            <div style={{ padding:'0 12px 10px', display:'flex', justifyContent:'flex-end' }}>
              <button onClick={() => removeSlide(i)} style={{ fontSize:11, color:'#c00', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Slaytı Sil</button>
            </div>
          </div>
        ))}
        <button className="btn" style={{ border:'1px dashed var(--border)', color:'var(--green)', fontWeight:700 }} onClick={addSlide}>+ Slayt Ekle</button>
      </Section>

      {/* 3 — İstatistikler */}
      <Section title="📊 İstatistikler">
        {stats.map((s, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 80px 60px', gap:8, alignItems:'end' }}>
            <div className="form-group" style={{ margin:0 }}><label className="form-label" style={{ fontSize:11 }}>Etiket</label><input className="form-input" style={inputSm} value={s.label} onChange={e => setStat(i,'label',e.target.value)} /></div>
            <div className="form-group" style={{ margin:0 }}><label className="form-label" style={{ fontSize:11 }}>Değer</label><input className="form-input" style={inputSm} type="number" value={s.value} onChange={e => setStat(i,'value',Number(e.target.value))} /></div>
            <div className="form-group" style={{ margin:0 }}><label className="form-label" style={{ fontSize:11 }}>Sonek</label><input className="form-input" style={inputSm} value={s.suffix} onChange={e => setStat(i,'suffix',e.target.value)} /></div>
          </div>
        ))}
      </Section>

      {/* 4 — Akan Yazı */}
      <Section title="📢 Akan Yazı (Ticker)">
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>Her satır ayrı bir mesaj. Emoji ekleyebilirsiniz.</div>
        <textarea className="form-input form-textarea" style={{ height:120, fontSize:13 }} value={ticker} onChange={e => setTicker(e.target.value)} />
      </Section>

      {/* 5 — İletişim */}
      <Section title="📞 İletişim Bilgileri">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div className="form-group"><label className="form-label">📍 Adres</label><input className="form-input" value={ctc.address||''} onChange={e => setCtc(f => ({ ...f, address:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">📞 Telefon</label><input className="form-input" value={ctc.phone||''} onChange={e => setCtc(f => ({ ...f, phone:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">📞 Telefon 2</label><input className="form-input" value={ctc.phone2||''} onChange={e => setCtc(f => ({ ...f, phone2:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">✉️ E-posta</label><input className="form-input" value={ctc.email||''} onChange={e => setCtc(f => ({ ...f, email:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">⏰ Çalışma Saatleri</label><input className="form-input" value={ctc.hours||''} onChange={e => setCtc(f => ({ ...f, hours:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">📸 Instagram (kullanıcı adı)</label><input className="form-input" value={ctc.instagram||''} onChange={e => setCtc(f => ({ ...f, instagram:e.target.value }))} placeholder="uskudaranadolusk" /></div>
          <div className="form-group"><label className="form-label">𝕏 Twitter/X (kullanıcı adı)</label><input className="form-input" value={ctc.twitter||''} onChange={e => setCtc(f => ({ ...f, twitter:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">📘 Facebook (kullanıcı adı)</label><input className="form-input" value={ctc.facebook||''} onChange={e => setCtc(f => ({ ...f, facebook:e.target.value }))} /></div>
          <div className="form-group"><label className="form-label">▶️ YouTube (kanal adı)</label><input className="form-input" value={ctc.youtube||''} onChange={e => setCtc(f => ({ ...f, youtube:e.target.value }))} placeholder="uskudaranadolusporkulubu5591" /></div>
          <div className="form-group" style={{ gridColumn:'span 2' }}><label className="form-label">🗺️ Harita Embed Kodu (iframe src)</label><input className="form-input" value={ctc.mapEmbed||''} onChange={e => setCtc(f => ({ ...f, mapEmbed:e.target.value }))} placeholder="https://maps.google.com/maps?..." /></div>
          <div className="form-group" style={{ gridColumn:'span 2' }}><label className="form-label">Hakkında Metni</label><textarea className="form-input form-textarea" style={{ height:80 }} value={ctc.about||''} onChange={e => setCtc(f => ({ ...f, about:e.target.value }))} /></div>
        </div>
      </Section>

      {/* 6 — Branş Ayarları */}
      <Section title="⚽ Branş Ayarları">
        {BRANCH_IDS.map(id => (
          <div key={id} style={{ border:'1px solid var(--border)', borderRadius:10, padding:16, marginBottom:8 }}>
            <div style={{ fontWeight:800, fontSize:14, color:'var(--green)', marginBottom:12 }}>{BRANCH_NAMES[id]}</div>
            <div style={{ display:'grid', gap:10 }}>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Açıklama</label><textarea className="form-input form-textarea" style={{ height:70 }} value={branches[id]?.desc||''} onChange={e => setBranchField(id,'desc',e.target.value)} /></div>
              <div className="form-group" style={{ margin:0 }}><label className="form-label">Antrenman Saatleri</label><input className="form-input" value={branches[id]?.schedule||''} onChange={e => setBranchField(id,'schedule',e.target.value)} /></div>
              <div>
                <label className="form-label">Başarılar</label>
                {(branches[id]?.achievements||[]).map((a, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                    <input className="form-input" style={{ ...inputSm, flex:1 }} value={a} onChange={e => setBranchListItem(id,'achievements',i,e.target.value)} />
                    <button onClick={() => removeBranchListItem(id,'achievements',i)} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'4px 10px', color:'#c00', cursor:'pointer', fontWeight:700 }}>×</button>
                  </div>
                ))}
                <button onClick={() => addBranchListItem(id,'achievements')} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'4px 12px', cursor:'pointer', fontWeight:700 }}>+ Başarı Ekle</button>
              </div>
              <div>
                <label className="form-label">Takım Listesi</label>
                {(branches[id]?.teams||[]).map((t, i) => (
                  <div key={i} style={{ display:'flex', gap:6, marginBottom:6 }}>
                    <input className="form-input" style={{ ...inputSm, flex:1 }} value={t} onChange={e => setBranchListItem(id,'teams',i,e.target.value)} />
                    <button onClick={() => removeBranchListItem(id,'teams',i)} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'4px 10px', color:'#c00', cursor:'pointer', fontWeight:700 }}>×</button>
                  </div>
                ))}
                <button onClick={() => addBranchListItem(id,'teams')} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'4px 12px', cursor:'pointer', fontWeight:700 }}>+ Takım Ekle</button>
              </div>
            </div>
          </div>
        ))}
      </Section>

      {/* 7 — Hakkımızda */}
      <Section title="🏛️ Hakkımızda Sayfası">
        <div className="form-group"><label className="form-label">Misyon</label><textarea className="form-input form-textarea" style={{ height:80 }} value={about.mission||''} onChange={e => setAboutField('mission',e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Vizyon</label><textarea className="form-input form-textarea" style={{ height:80 }} value={about.vision||''} onChange={e => setAboutField('vision',e.target.value)} /></div>

        <div>
          <label className="form-label">📅 Tarihçe (Milestones)</label>
          {(about.milestones||[]).map((m, i) => (
            <div key={i} style={{ border:'1px solid var(--border)', borderRadius:8, padding:12, marginBottom:8 }}>
              <div style={{ display:'grid', gridTemplateColumns:'80px 1fr auto', gap:8, marginBottom:8 }}>
                <input className="form-input" style={inputSm} placeholder="Yıl" value={m.year} onChange={e => setMilestone(i,'year',e.target.value)} />
                <input className="form-input" style={inputSm} placeholder="Başlık" value={m.title} onChange={e => setMilestone(i,'title',e.target.value)} />
                <button onClick={() => removeMilestone(i)} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'4px 10px', color:'#c00', cursor:'pointer', fontWeight:700 }}>×</button>
              </div>
              <textarea className="form-input form-textarea" style={{ height:60, fontSize:12 }} placeholder="Açıklama" value={m.desc} onChange={e => setMilestone(i,'desc',e.target.value)} />
            </div>
          ))}
          <button onClick={addMilestone} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'5px 14px', cursor:'pointer', fontWeight:700 }}>+ Dönem Ekle</button>
        </div>

        <div>
          <label className="form-label">💡 Değerlerimiz</label>
          {(about.values||[]).map((v, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'50px 1fr 1fr auto', gap:8, marginBottom:8, alignItems:'end' }}>
              <input className="form-input" style={inputSm} placeholder="İkon" value={v.icon} onChange={e => setValue(i,'icon',e.target.value)} />
              <input className="form-input" style={inputSm} placeholder="Başlık" value={v.title} onChange={e => setValue(i,'title',e.target.value)} />
              <input className="form-input" style={inputSm} placeholder="Açıklama" value={v.desc} onChange={e => setValue(i,'desc',e.target.value)} />
              <button onClick={() => removeValue(i)} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'6px 10px', color:'#c00', cursor:'pointer', fontWeight:700 }}>×</button>
            </div>
          ))}
          <button onClick={addValue} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'5px 14px', cursor:'pointer', fontWeight:700 }}>+ Değer Ekle</button>
        </div>

        <div>
          <label className="form-label">👔 Yönetim Kurulu</label>
          {(about.board||[]).map((b, i) => (
            <div key={i} style={{ border:'1px solid var(--border)', borderRadius:8, padding:12, marginBottom:8 }}>
              <div style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:12, marginBottom:8 }}>
                <ImageUpload value={b.image} onChange={v => setBoard(i,'image',v)} label="Fotoğraf" square />
                <div style={{ display:'grid', gap:8 }}>
                  <input className="form-input" style={inputSm} placeholder="Ad Soyad" value={b.name} onChange={e => setBoard(i,'name',e.target.value)} />
                  <input className="form-input" style={inputSm} placeholder="Unvan" value={b.title} onChange={e => setBoard(i,'title',e.target.value)} />
                  <input className="form-input" style={inputSm} placeholder="İkon (emoji)" value={b.icon} onChange={e => setBoard(i,'icon',e.target.value)} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                <input className="form-input" style={inputSm} placeholder="E-posta" value={b.email||''} onChange={e => setBoard(i,'email',e.target.value)} />
                <input className="form-input" style={inputSm} placeholder="Telefon" value={b.phone||''} onChange={e => setBoard(i,'phone',e.target.value)} />
              </div>
              <textarea className="form-input form-textarea" style={{ height:70, fontSize:12, marginBottom:8 }} placeholder="Biyografi (opsiyonel)" value={b.bio||''} onChange={e => setBoard(i,'bio',e.target.value)} />
              <button onClick={() => removeBoard(i)} style={{ fontSize:12, color:'#c00', background:'none', border:'none', cursor:'pointer', fontWeight:700 }}>Sil</button>
            </div>
          ))}
          <button onClick={addBoard} style={{ fontSize:12, color:'var(--green)', background:'none', border:'1px dashed var(--green)', borderRadius:6, padding:'5px 14px', cursor:'pointer', fontWeight:700 }}>+ Yönetici Ekle</button>
        </div>
      </Section>

      <div style={{ marginTop:24, textAlign:'right' }}>
        <button className="btn btn-primary" style={{ padding:'12px 32px', fontSize:15 }} onClick={saveAll}>💾 Tümünü Kaydet</button>
      </div>
    </div>
  )
}

// ── FİKSTÜR ──────────────────────────────────────────────────────────────────
function FixturesTab() {
  const { fixtures, addFixture, updateFixture, deleteFixture } = useStore()
  const toast = useToast()
  const empty = { branch: 'Futbol', homeTeam: 'Üsküdar Anadolu SK', awayTeam: '', date: new Date().toISOString().slice(0,10), time: '', location: '', competition: '', result: '', status: 'upcoming' }
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const openNew  = () => { setForm(empty); setEditing('new') }
  const openEdit = (f) => { setForm({ ...f }); setEditing(f.id) }
  const cancel   = () => setEditing(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    if (!form.awayTeam.trim()) { toast('Rakip takım zorunlu', 'error'); return }
    if (editing === 'new') addFixture(form); else updateFixture(editing, form)
    toast(editing === 'new' ? 'Maç eklendi ✓' : 'Güncellendi ✓')
    cancel()
  }

  const sorted = [...fixtures].sort((a, b) => new Date(b.date) - new Date(a.date))

  const inputSm = { padding: '7px 10px', fontSize: 13 }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <h2 style={{ margin:0, fontWeight:900, fontSize:20 }}>📅 Fikstür</h2>
        <button className="btn btn-primary btn-ripple" onClick={openNew}>+ Maç Ekle</button>
      </div>

      {editing && (
        <div style={{ background:'var(--gray-bg)', borderRadius:12, padding:20, marginBottom:24, border:'1px solid var(--border)' }}>
          <h3 style={{ margin:'0 0 16px', fontWeight:800 }}>{editing === 'new' ? 'Yeni Maç' : 'Maçı Düzenle'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Branş</label>
              <select className="form-input" style={inputSm} value={form.branch} onChange={e => set('branch', e.target.value)}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Durum</label>
              <select className="form-input" style={inputSm} value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="upcoming">Yaklaşan</option>
                <option value="played">Oynandı</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Ev Sahibi Takım</label>
              <input className="form-input" style={inputSm} value={form.homeTeam} onChange={e => set('homeTeam', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Deplasman Takımı</label>
              <input className="form-input" style={inputSm} value={form.awayTeam} onChange={e => set('awayTeam', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Tarih</label>
              <input className="form-input" style={inputSm} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Saat</label>
              <input className="form-input" style={inputSm} type="time" value={form.time} onChange={e => set('time', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Yer / Stat</label>
              <input className="form-input" style={inputSm} value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin:0 }}>
              <label className="form-label">Müsabaka / Lig</label>
              <input className="form-input" style={inputSm} value={form.competition} onChange={e => set('competition', e.target.value)} />
            </div>
            {form.status === 'played' && (
              <div className="form-group" style={{ margin:0, gridColumn:'span 2' }}>
                <label className="form-label">Skor (örn: 2-1)</label>
                <input className="form-input" style={inputSm} value={form.result} onChange={e => set('result', e.target.value)} placeholder="2-1" />
              </div>
            )}
          </div>
          <div style={{ display:'flex', gap:10, marginTop:16, justifyContent:'flex-end' }}>
            <button className="btn" style={{ border:'1px solid var(--border)' }} onClick={cancel}>İptal</button>
            <button className="btn btn-primary btn-ripple" onClick={save}>Kaydet</button>
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text-muted)' }}>
          <div style={{ fontSize:40, marginBottom:8 }}>📅</div>
          <p>Henüz maç eklenmemiş.</p>
        </div>
      )}

      <div style={{ display:'grid', gap:10 }}>
        {sorted.map(f => (
          <div key={f.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', border:'1px solid var(--border)', borderRadius:10, background:'#fafafa' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, marginBottom:2 }}>{f.branch} · {f.competition}</div>
              <div style={{ fontWeight:800, fontSize:14 }}>{f.homeTeam} <span style={{ color:'var(--text-muted)', fontWeight:600 }}>vs</span> {f.awayTeam}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{f.date} {f.time && `· ${f.time}`} {f.location && `· ${f.location}`}</div>
            </div>
            {f.result && <div style={{ fontWeight:900, fontSize:18, fontFamily:'var(--font-display)', color:'#1a1a1a', padding:'4px 12px', background:'#f0f0f0', borderRadius:8 }}>{f.result}</div>}
            <div style={{ fontSize:11, fontWeight:700, color: f.status === 'upcoming' ? 'var(--green)' : f.status === 'cancelled' ? '#c00' : '#555', background: f.status === 'upcoming' ? 'var(--green-pale)' : '#f0f0f0', padding:'3px 10px', borderRadius:20 }}>
              {f.status === 'upcoming' ? 'Yaklaşan' : f.status === 'played' ? 'Oynandı' : 'İptal'}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={() => openEdit(f)} style={{ background:'var(--green-pale)', border:'none', borderRadius:6, padding:'5px 12px', color:'var(--green)', fontWeight:700, cursor:'pointer', fontSize:12 }}>Düzenle</button>
              <button onClick={() => { if (confirm('Silinsin mi?')) { deleteFixture(f.id); toast('Silindi') } }} style={{ background:'#fee2e2', border:'none', borderRadius:6, padding:'5px 12px', color:'#c00', fontWeight:700, cursor:'pointer', fontSize:12 }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── ANA PANEL ────────────────────────────────────────────────────────────────
export default function Admin() {
  const { isAdmin, logout, currentUser } = useAuth()
  const { settings } = useSite()
  const navigate = useNavigate()
  const [tab, setTab] = useState('news')

  if (!isAdmin) return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
        <div style={{ fontWeight:700, fontSize:18, marginBottom:8 }}>Yetkisiz Erişim</div>
        <div style={{ color:'var(--text-muted)', marginBottom:20 }}>Bu sayfaya erişmek için admin hesabıyla giriş yapın.</div>
        <button className="btn btn-primary" onClick={() => navigate('/giris')}>Giriş Yap</button>
      </div>
    </div>
  )

  return (
    <div style={{ background:'var(--gray-bg)', minHeight:'100vh' }}>
      {/* Panel başlığı */}
      <div style={{ background:'var(--green-dark)', color:'#fff', padding:'14px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {settings.logo
            ? <img src={settings.logo} alt="logo" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,.4)' }} />
            : <div style={{ width:36, height:36, background:'rgba(255,255,255,.15)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>⚽</div>
          }
          <div>
            <div style={{ fontWeight:900, fontSize:16 }}>Yönetim Paneli</div>
            <div style={{ fontSize:11, opacity:.7 }}>{settings.clubName}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:13, opacity:.8 }}>👋 {currentUser?.name}</span>
          <button onClick={() => navigate('/')} style={{ background:'rgba(255,255,255,.12)', border:'none', color:'#fff', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13 }}>Siteye Git</button>
          <button onClick={() => { logout(); navigate('/') }} style={{ background:'rgba(255,255,255,.12)', border:'none', color:'#fff', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13 }}>Çıkış</button>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'24px 16px' }}>
        {/* Sekmeler */}
        <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding:'10px 18px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:600, fontSize:13,
                background: tab === t.id ? 'var(--green)' : '#fff',
                color: tab === t.id ? '#fff' : 'var(--text)',
                boxShadow:'0 1px 4px rgba(0,0,0,.08)', transition:'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel içerik */}
        <div style={{ background:'#fff', borderRadius:12, padding:24, boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
          {tab === 'news'     && <NewsTab />}
          {tab === 'fixtures' && <FixturesTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'players'  && <PlayersTab />}
          {tab === 'members'  && <MembersTab />}
          {tab === 'site'     && <SiteTab />}
        </div>
      </div>
    </div>
  )
}
