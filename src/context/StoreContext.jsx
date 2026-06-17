import React, { createContext, useContext, useState, useEffect } from 'react'

const StoreContext = createContext(null)

const DEFAULT_CONTACT = {
  address: 'Üsküdar Spor Kompleksi, Beylerbeyi Mah. Spor Cad. No:1, Üsküdar / İstanbul',
  phone: '0216 XXX XX XX', phone2: '', email: 'info@uskudaranadolu.com', email2: '',
  hours: 'Pzt–Cmt: 07:00–22:00 · Pazar: 09:00–18:00', mapEmbed: '',
  instagram: 'uskudaranadolusk', twitter: 'uskudaranadolusk', facebook: 'uskudaranadoluspor', youtube: 'uskudaranadolusporkulubu5591',
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
  {
    id: 1, branch: 'Futbol', team: 'A Takım',
    players: [
      { id: 101, name: 'Murat Şahin', number: 1, position: 'Kaleci', age: 28, image: null },
      { id: 102, name: 'Emre Yıldız', number: 4, position: 'Defans', age: 24, image: null },
      { id: 103, name: 'Burak Çelik', number: 9, position: 'Forvet', age: 26, image: null },
      { id: 104, name: 'Kerem Aydın', number: 10, position: 'Orta Saha', age: 22, image: null },
    ]
  },
  {
    id: 2, branch: 'Basketbol', team: 'Erkek Takım',
    players: [
      { id: 201, name: 'Tarık Güneş', number: 5, position: 'Pivot', age: 27, image: null },
      { id: 202, name: 'Serkan Kurt', number: 12, position: 'Guard', age: 23, image: null },
    ]
  },
  {
    id: 3, branch: 'Basketbol', team: 'Kadın Takım',
    players: [
      { id: 301, name: 'Ayşe Demir', number: 7, position: 'Forward', age: 25, image: null },
      { id: 302, name: 'Elif Kara', number: 11, position: 'Guard', age: 21, image: null },
    ]
  },
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

function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export function StoreProvider({ children }) {
  const [news, setNews]         = useState(() => load('usk_news', DEFAULT_NEWS))
  const [products, setProducts] = useState(() => load('usk_products', DEFAULT_PRODUCTS))
  const [members, setMembers]   = useState(() => load('usk_members', DEFAULT_MEMBERS))
  const [contact, setContact]   = useState(() => load('usk_contact', DEFAULT_CONTACT))
  const [reviews, setReviews]   = useState(() => load('usk_reviews', []))
  const [players, setPlayers]   = useState(() => load('usk_players', DEFAULT_PLAYERS))
  const [fixtures, setFixtures] = useState(() => load('usk_fixtures', DEFAULT_FIXTURES))

  useEffect(() => save('usk_news', news), [news])
  useEffect(() => save('usk_products', products), [products])
  useEffect(() => save('usk_members', members), [members])
  useEffect(() => save('usk_contact', contact), [contact])
  useEffect(() => save('usk_reviews', reviews), [reviews])
  useEffect(() => save('usk_players', players), [players])
  useEffect(() => save('usk_fixtures', fixtures), [fixtures])

  // Haberler
  const addNews    = (i) => setNews(p => [{ ...i, id: Date.now(), published: true }, ...p])
  const updateNews = (id, i) => setNews(p => p.map(n => n.id === id ? { ...n, ...i } : n))
  const deleteNews = (id) => setNews(p => p.filter(n => n.id !== id))

  // Ürünler
  const addProduct    = (i) => setProducts(p => [{ ...i, id: Date.now(), rating: 0, reviewCount: 0 }, ...p])
  const updateProduct = (id, i) => setProducts(p => p.map(x => x.id === id ? { ...x, ...i } : x))
  const deleteProduct = (id) => setProducts(p => p.filter(x => x.id !== id))

  // Üyeler
  const addMember    = (i) => setMembers(p => [{ ...i, id: Date.now(), date: new Date().toISOString().slice(0,10), status: 'pending' }, ...p])
  const updateMember = (id, i) => setMembers(p => p.map(m => m.id === id ? { ...m, ...i } : m))
  const deleteMember = (id) => setMembers(p => p.filter(m => m.id !== id))

  // İletişim
  const updateContact = (data) => setContact(prev => ({ ...prev, ...data }))

  // Yorumlar
  const addReview = (productId, review) => {
    const r = { ...review, id: Date.now(), productId, date: new Date().toISOString().slice(0,10) }
    setReviews(prev => [r, ...prev])
    const allForProduct = [r, ...reviews.filter(x => x.productId === productId)]
    const avg = allForProduct.reduce((s, x) => s + x.rating, 0) / allForProduct.length
    updateProduct(productId, { rating: Math.round(avg * 10) / 10, reviewCount: allForProduct.length })
  }
  const getReviews = (productId) => reviews.filter(r => r.productId === productId)

  // Fikstür
  const addFixture    = (f) => setFixtures(p => [{ ...f, id: Date.now() }, ...p])
  const updateFixture = (id, f) => setFixtures(p => p.map(x => x.id === id ? { ...x, ...f } : x))
  const deleteFixture = (id) => setFixtures(p => p.filter(x => x.id !== id))

  // Oyuncu Kadroları
  const addTeam = (team) => setPlayers(p => [...p, { ...team, id: Date.now(), players: [] }])
  const updateTeam = (id, data) => setPlayers(p => p.map(t => t.id === id ? { ...t, ...data } : t))
  const deleteTeam = (id) => setPlayers(p => p.filter(t => t.id !== id))
  const addPlayer = (teamId, player) => setPlayers(p => p.map(t => t.id === teamId ? { ...t, players: [...t.players, { ...player, id: Date.now() }] } : t))
  const updatePlayer = (teamId, playerId, data) => setPlayers(p => p.map(t => t.id === teamId ? { ...t, players: t.players.map(pl => pl.id === playerId ? { ...pl, ...data } : pl) } : t))
  const deletePlayer = (teamId, playerId) => setPlayers(p => p.map(t => t.id === teamId ? { ...t, players: t.players.filter(pl => pl.id !== playerId) } : t))

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
