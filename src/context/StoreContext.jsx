import React, { createContext, useContext, useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const StoreContext = createContext(null)

const DEFAULT_CONTACT = {
  address: 'Üsküdar Spor Kompleksi, Beylerbeyi Mah. Spor Cad. No:1, Üsküdar / İstanbul',
  phone: '0216 XXX XX XX', phone2: '', email: 'info@uskudaranadolu.com', email2: '',
  hours: 'Pzt–Cmt: 07:00–22:00 · Pazar: 09:00–18:00', mapEmbed: '',
  instagram: 'anadoluskudar1908', twitter: 'uskudaranadolusk', facebook: 'uskudaranadoluspor', youtube: 'uskudaranadolusporkulubu5591',
  about: '1908 yılında kurulan Üsküdar Anadolu Spor Kulübü, İstanbul\'un köklü spor kulüplerinden biridir.',
}

const DEFAULT_NEWS = [
  { id: 1, title: 'Bölge kupasında finale yükseldik', category: 'Futbol', icon: '🏆', date: '2026-06-08', content: 'Üsküdar Anadolu Spor Kulübü bölge kupasında finale yükselmeyi başardı.', published: true, image: null },
  { id: 2, title: 'Kadın basketbol takımı ligde lider', category: 'Basketbol', icon: '🏀', date: '2026-06-05', content: 'Kadın basketbol takımımız bu sezon muhteşem bir performans sergileyerek ligin zirvesine yerleşti.', published: true, image: null },
  { id: 3, title: 'Yaz yüzme kursları kayıtları açıldı', category: 'Voleybol', icon: '🏐', date: '2026-06-01', content: 'Yaz dönemi yüzme kurslarımız için kayıtlar başlamıştır.', published: true, image: null },
  { id: 4, title: 'Masa tenisinde il birinciliği', category: 'Masa Tenisi', icon: '🏓', date: '2026-05-28', content: 'Sporcularımız il masa tenisi şampiyonasında başarılı sonuçlar elde etti.', published: true, image: null },
  { id: 5, title: 'Altyapıya 3 yeni transfer', category: 'Futbol', icon: '⚽', date: '2026-05-20', content: 'Altyapı takımlarımızı güçlendirmek adına 3 yeni sporcu kadromuza katıldı.', published: true, image: null },
]

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Resmi Forma (Ev)', desc: '2025–26 Sezonu · Nefes alabilen kumaş · Resmi kulüp arması', icon: '👕', price: 850, discountPrice: 450, stock: 50, category: 'Giyim', image: null, sizes: ['S','M','L','XL','XXL'], colors: ['Yeşil','Beyaz'], rating: 4.7, reviewCount: 34 },
  { id: 2, name: 'Kulüp Eşofmanı', desc: 'Unisex · S–XXL · %100 Pamuk', icon: '🧥', price: 900, discountPrice: 680, stock: 30, category: 'Giyim', image: null, sizes: ['S','M','L','XL'], colors: ['Yeşil','Lacivert'], rating: 4.5, reviewCount: 18 },
  { id: 3, name: 'Kulüp Şapkası', desc: 'Ayarlanabilir · Nakış logo', icon: '🧢', price: 180, discountPrice: null, stock: 100, category: 'Aksesuar', image: null, sizes: [], colors: ['Yeşil','Siyah','Beyaz'], rating: 4.8, reviewCount: 52 },
  { id: 4, name: 'Resmi Maç Topu', desc: 'FIFA Onaylı · No:5', icon: '⚽', price: 350, discountPrice: null, stock: 20, category: 'Ekipman', image: null, sizes: [], colors: [], rating: 4.6, reviewCount: 11 },
  { id: 5, name: 'Spor Çorap (3\'lü)', desc: 'Kulüp renkleri · Pamuklu', icon: '🧦', price: 120, discountPrice: 90, stock: 200, category: 'Giyim', image: null, sizes: ['36-39','40-43','44-46'], colors: ['Yeşil/Beyaz'], rating: 4.3, reviewCount: 29 },
  { id: 6, name: 'Kulüp Sırt Çantası', desc: '30L · Laptop bölmeli · Su geçirmez', icon: '🎒', price: 750, discountPrice: 520, stock: 25, category: 'Aksesuar', image: null, sizes: [], colors: ['Yeşil','Siyah'], rating: 4.9, reviewCount: 43 },
  { id: 7, name: 'Logolu Kupa', desc: 'Seramik · 350ml · Dishwasher safe', icon: '🏆', price: 120, discountPrice: null, stock: 80, category: 'Hediyelik', image: null, sizes: [], colors: ['Beyaz','Yeşil'], rating: 4.4, reviewCount: 17 },
  { id: 8, name: 'Matara', desc: 'Paslanmaz çelik · 750ml · BPA free', icon: '🧴', price: 280, discountPrice: 220, stock: 40, category: 'Ekipman', image: null, sizes: [], colors: ['Yeşil','Gri'], rating: 4.7, reviewCount: 22 },
]

const DEFAULT_PLAYERS = [
  { id: 1, branch: 'Futbol', team: 'A Takım', players: [
    { id: 101, name: 'Murat Şahin', number: 1, position: 'Kaleci', age: 28, image: null },
    { id: 102, name: 'Emre Yıldız', number: 4, position: 'Defans', age: 24, image: null },
    { id: 103, name: 'Burak Çelik', number: 9, position: 'Forvet', age: 26, image: null },
    { id: 104, name: 'Kerem Aydın', number: 10, position: 'Orta Saha', age: 22, image: null },
  ]},
  { id: 2, branch: 'Basketbol', team: 'Erkek Takım', players: [
    { id: 201, name: 'Tarık Güneş', number: 5, position: 'Pivot', age: 27, image: null },
    { id: 202, name: 'Serkan Kurt', number: 12, position: 'Guard', age: 23, image: null },
  ]},
  { id: 3, branch: 'Basketbol', team: 'Kadın Takım', players: [
    { id: 301, name: 'Ayşe Demir', number: 7, position: 'Forward', age: 25, image: null },
    { id: 302, name: 'Elif Kara', number: 11, position: 'Guard', age: 21, image: null },
  ]},
]

const DEFAULT_FIXTURES = [
  { id: 1, branch: 'Futbol', homeTeam: 'Üsküdar Anadolu SK', awayTeam: 'Beykoz SK', date: '2026-06-15', time: '15:00', location: 'Üsküdar Spor Tesisi', competition: 'Bölge Ligi', result: '', status: 'upcoming' },
  { id: 2, branch: 'Futbol', homeTeam: 'Kadıköy SK', awayTeam: 'Üsküdar Anadolu SK', date: '2026-06-22', time: '17:00', location: 'Kadıköy Sahası', competition: 'Bölge Ligi', result: '', status: 'upcoming' },
  { id: 3, branch: 'Basketbol', homeTeam: 'Üsküdar Anadolu SK', awayTeam: 'Ataşehir Spor', date: '2026-06-18', time: '19:00', location: 'Üsküdar Spor Salonu', competition: 'İl Ligi', result: '', status: 'upcoming' },
  { id: 4, branch: 'Futbol', homeTeam: 'Üsküdar Anadolu SK', awayTeam: 'Pendik Gençlik', date: '2026-06-08', time: '14:00', location: 'Üsküdar Spor Tesisi', competition: 'Bölge Kupası', result: '3-1', status: 'played' },
]

const DEFAULT_MEMBERS = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@mail.com', phone: '0532 111 22 33', branch: 'Futbol', plan: 'Premium', status: 'active', date: '2026-03-01' },
  { id: 2, name: 'Fatma Kaya', email: 'fatma@mail.com', phone: '0533 222 33 44', branch: 'Basketbol', plan: 'Standart', status: 'active', date: '2026-03-15' },
]

function lsLoad(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function lsSave(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

function fsSet(collection, docId, data) {
  setDoc(doc(db, collection, docId), data).catch(() => {})
}

export function StoreProvider({ children }) {
  const [news, setNews]         = useState(() => lsLoad('usk_news', DEFAULT_NEWS))
  const [products, setProducts] = useState(() => lsLoad('usk_products', DEFAULT_PRODUCTS))
  const [members, setMembers]   = useState(() => lsLoad('usk_members', DEFAULT_MEMBERS))
  const [contact, setContact]   = useState(() => lsLoad('usk_contact', DEFAULT_CONTACT))
  const [reviews, setReviews]   = useState(() => lsLoad('usk_reviews', []))
  const [players, setPlayers]   = useState(() => lsLoad('usk_players', DEFAULT_PLAYERS))
  const [fixtures, setFixtures] = useState(() => lsLoad('usk_fixtures', DEFAULT_FIXTURES))

  // Firestore real-time listeners
  useEffect(() => {
    const subs = [
      onSnapshot(doc(db, 'store', 'news'),     s => { if (s.exists()) { const d = s.data().items; setNews(d); lsSave('usk_news', d) } }),
      onSnapshot(doc(db, 'store', 'products'), s => { if (s.exists()) { const d = s.data().items; setProducts(d); lsSave('usk_products', d) } }),
      onSnapshot(doc(db, 'store', 'members'),  s => { if (s.exists()) { const d = s.data().items; setMembers(d); lsSave('usk_members', d) } }),
      onSnapshot(doc(db, 'store', 'contact'),  s => { if (s.exists()) { const d = s.data(); delete d._v; setContact(d); lsSave('usk_contact', d) } }),
      onSnapshot(doc(db, 'store', 'reviews'),  s => { if (s.exists()) { const d = s.data().items; setReviews(d); lsSave('usk_reviews', d) } }),
      onSnapshot(doc(db, 'store', 'players'),  s => { if (s.exists()) { const d = s.data().items; setPlayers(d); lsSave('usk_players', d) } }),
      onSnapshot(doc(db, 'store', 'fixtures'), s => { if (s.exists()) { const d = s.data().items; setFixtures(d); lsSave('usk_fixtures', d) } }),
    ]
    return () => subs.forEach(u => u())
  }, [])

  // Haberler
  const addNews    = (i) => { const updated = [{ ...i, id: Date.now(), published: true }, ...news]; setNews(updated); lsSave('usk_news', updated); fsSet('store', 'news', { items: updated }) }
  const updateNews = (id, i) => { const updated = news.map(n => n.id === id ? { ...n, ...i } : n); setNews(updated); lsSave('usk_news', updated); fsSet('store', 'news', { items: updated }) }
  const deleteNews = (id) => { const updated = news.filter(n => n.id !== id); setNews(updated); lsSave('usk_news', updated); fsSet('store', 'news', { items: updated }) }

  // Ürünler
  const addProduct    = (i) => { const updated = [{ ...i, id: Date.now(), rating: 0, reviewCount: 0 }, ...products]; setProducts(updated); lsSave('usk_products', updated); fsSet('store', 'products', { items: updated }) }
  const updateProduct = (id, i) => { const updated = products.map(x => x.id === id ? { ...x, ...i } : x); setProducts(updated); lsSave('usk_products', updated); fsSet('store', 'products', { items: updated }) }
  const deleteProduct = (id) => { const updated = products.filter(x => x.id !== id); setProducts(updated); lsSave('usk_products', updated); fsSet('store', 'products', { items: updated }) }

  // Üyeler
  const addMember    = (i) => { const updated = [{ ...i, id: Date.now(), date: new Date().toISOString().slice(0,10), status: 'pending' }, ...members]; setMembers(updated); lsSave('usk_members', updated); fsSet('store', 'members', { items: updated }) }
  const updateMember = (id, i) => { const updated = members.map(m => m.id === id ? { ...m, ...i } : m); setMembers(updated); lsSave('usk_members', updated); fsSet('store', 'members', { items: updated }) }
  const deleteMember = (id) => { const updated = members.filter(m => m.id !== id); setMembers(updated); lsSave('usk_members', updated); fsSet('store', 'members', { items: updated }) }

  // İletişim
  const updateContact = (data) => { const updated = { ...contact, ...data }; setContact(updated); lsSave('usk_contact', updated); fsSet('store', 'contact', { ...updated, _v: Date.now() }) }

  // Yorumlar
  const addReview = (productId, review) => {
    const r = { ...review, id: Date.now(), productId, date: new Date().toISOString().slice(0,10) }
    const updated = [r, ...reviews]
    setReviews(updated); lsSave('usk_reviews', updated); fsSet('store', 'reviews', { items: updated })
    const allForProduct = updated.filter(x => x.productId === productId)
    const avg = allForProduct.reduce((s, x) => s + x.rating, 0) / allForProduct.length
    updateProduct(productId, { rating: Math.round(avg * 10) / 10, reviewCount: allForProduct.length })
  }
  const getReviews = (productId) => reviews.filter(r => r.productId === productId)

  // Fikstür
  const addFixture    = (f) => { const updated = [{ ...f, id: Date.now() }, ...fixtures]; setFixtures(updated); lsSave('usk_fixtures', updated); fsSet('store', 'fixtures', { items: updated }) }
  const updateFixture = (id, f) => { const updated = fixtures.map(x => x.id === id ? { ...x, ...f } : x); setFixtures(updated); lsSave('usk_fixtures', updated); fsSet('store', 'fixtures', { items: updated }) }
  const deleteFixture = (id) => { const updated = fixtures.filter(x => x.id !== id); setFixtures(updated); lsSave('usk_fixtures', updated); fsSet('store', 'fixtures', { items: updated }) }

  // Oyuncu Kadroları
  const addTeam    = (team) => { const updated = [...players, { ...team, id: Date.now(), players: [] }]; setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }
  const updateTeam = (id, data) => { const updated = players.map(t => t.id === id ? { ...t, ...data } : t); setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }
  const deleteTeam = (id) => { const updated = players.filter(t => t.id !== id); setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }
  const addPlayer  = (teamId, player) => { const updated = players.map(t => t.id === teamId ? { ...t, players: [...t.players, { ...player, id: Date.now() }] } : t); setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }
  const updatePlayer = (teamId, playerId, data) => { const updated = players.map(t => t.id === teamId ? { ...t, players: t.players.map(pl => pl.id === playerId ? { ...pl, ...data } : pl) } : t); setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }
  const deletePlayer = (teamId, playerId) => { const updated = players.map(t => t.id === teamId ? { ...t, players: t.players.filter(pl => pl.id !== playerId) } : t); setPlayers(updated); lsSave('usk_players', updated); fsSet('store', 'players', { items: updated }) }

  return (
    <StoreContext.Provider value={{
      news, addNews, updateNews, deleteNews,
      products, addProduct, updateProduct, deleteProduct,
      members, addMember, updateMember, deleteMember,
      contact, updateContact,
      reviews, addReview, getReviews,
      players, addTeam, updateTeam, deleteTeam, addPlayer, updatePlayer, deletePlayer,
      fixtures, addFixture, updateFixture, deleteFixture,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
