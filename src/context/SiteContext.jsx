import React, { createContext, useContext, useState, useEffect } from 'react'

const SiteContext = createContext(null)

const DEFAULT_SETTINGS = {
  clubName: 'Üsküdar Anadolu Spor Kulübü',
  clubShort: 'ÜSKÜDAR ANADOLU',
  clubSub: 'SPOR KULÜBÜ · EST. 1908',
  slogan: 'Sporu Tutkuyla Yaşatıyoruz',
  logo: null,
  colorGreen: '#00913A',
  colorDark: '#006B2B',
  colorLight: '#00B548',
  stats: [
    { label: 'Aktif Üye', value: 248, suffix: '+' },
    { label: 'Yıllık Deneyim', value: 41, suffix: '' },
    { label: 'Branş', value: 4, suffix: '' },
    { label: 'Şampiyona', value: 17, suffix: '' },
  ],
  slides: [
    { tag: 'Futbol', title: 'Bölge Kupasında\nFinale Yükseldik!', sub: 'Takımımız yarı finalde rakibini 3-1 mağlup ederek finale adını yazdırdı.', btn: 'Haberi Oku' },
    { tag: 'Basketbol', title: 'Kadın Takımı\nLigin Zirvesinde', sub: '14 maçta 12 galibiyet ile sezon tarihimizin en iyi performansını sergiliyoruz.', btn: 'Detaylar' },
    { tag: 'Voleybol', title: 'Yaz Kursları\nKayıtları Başladı', sub: 'Olimpik havuzumuzda 4-16 yaş arası tüm çocuklara yönelik yaz kurslarımız başlıyor.', btn: 'Kayıt Ol' },
    { tag: 'Kulüp', title: "1908'ten Beri\nÜsküdar'ın Gururu", sub: "Dört branşta yüzlerce sporcu ile İstanbul'un en köklü spor kulüplerinden biriyiz.", btn: 'Hakkımızda' },
  ],
  tickerItems: [
    '⚽ Futbol takımımız bölge kupası finalinde',
    '🏀 Kadın basketbol ligde lider',
    '🏐 Yaz yüzme kursları kayıtları açıldı',
    '🏓 Masa tenisi il birinciliği kazanıldı',
    '🎽 Yeni sezon ürünleri mağazada',
  ],
  footerAbout: "1908'ten bu yana Üsküdar'ın spor ailesi. Futbol, basketbol, yüzme ve masa tenisi branşlarımızla gençlere sporu sevdiriyor, şampiyonlar yetiştiriyoruz.",

  // Branş ayarları
  branches: {
    futbol: {
      desc: 'Kulübümüzün en köklü branşı. A takımı, kadın takımı ve altyapı kategorilerinde yüzlerce sporcumuz sahada.',
      schedule: 'Pzt, Çar, Cum: 17:00–19:00 · Hafta sonu: 10:00–12:00',
      achievements: ['Bölge Kupası Finalisti 2026', 'İl Şampiyonu 2024', 'Altyapı Kupası 2023'],
      teams: ['A Takım', 'Kadın Takım', 'U-19', 'U-17', 'U-15'],
    },
    basketbol: {
      desc: 'Erkek ve kadın takımlarımız bölge liginde mücadele ediyor. Genç yetenekler altyapımızda yetişiyor.',
      schedule: 'Sal, Per: 18:00–20:00 · Cumartesi: 11:00–13:00',
      achievements: ['Bölge Ligi 2.si 2026', 'Kadın Takımı Şampiyonu 2025', 'En İyi Altyapı Ödülü 2024'],
      teams: ['Erkek Takım', 'Kadın Takım', 'U-18', 'U-14'],
    },
    voleybol: {
      desc: 'Erkek ve kadın voleybol takımlarımız bölge liginde mücadele ediyor. Genç oyuncular altyapımızda yetişiyor.',
      schedule: 'Sal, Per: 17:00–19:00 · Cumartesi: 10:00–12:00',
      achievements: ['Bölge Ligi Finalisti 2026', 'Kadın Takımı 2.si 2025', 'En İyi Altyapı 2024'],
      teams: ['Erkek Takım', 'Kadın Takım', 'U-18', 'U-14'],
    },
    masatenisi: {
      desc: 'Bölge liginde mücadele eden takımımız ve bireysel sporcularımız ulusal başarılara imza atıyor.',
      schedule: 'Pzt-Cuma: 16:00–20:00 · Cumartesi: 10:00–14:00',
      achievements: ['İl Birincisi 2026', 'Bölge Şampiyonu 2025', 'Ulusal Turnuva 3.sü 2024'],
      teams: ['Erkek Takım', 'Kadın Takım', 'Gençler'],
    },
  },

  // Hakkımızda sayfası
  about: {
    mission: "Üsküdar halkına sporu sevdirmek, gençleri sağlıklı bir yaşam tarzına yönlendirmek ve ulusal arenada başarılı sporcular yetiştirmek.",
    vision: "Dört branşta Türkiye'nin en saygın spor kulüplerinden biri olmak; modern tesisler ve kaliteli kadromuzla sporda fark yaratmak.",
    milestones: [
      { year: '1908', title: 'Kuruluş', desc: "Üsküdar Anadolu Spor Kulübü, Üsküdar'ın spor hayatına katkı sağlamak amacıyla kuruldu." },
      { year: '1992', title: 'Basketbol Branşı', desc: 'Erkek basketbol takımı kurularak bölge ligine katılım sağlandı.' },
      { year: '2001', title: 'Olimpik Havuz', desc: 'Olimpik yüzme havuzunun açılmasıyla yüzme branşı faaliyete geçti.' },
      { year: '2010', title: 'Masa Tenisi', desc: 'Masa tenisi branşı ulusal liglerde boy göstermeye başladı.' },
      { year: '2018', title: 'Kadın Takımları', desc: 'Futbol ve basketbolda kadın takımları kurularak karma yapıya geçildi.' },
      { year: '2024', title: 'Dijital Dönüşüm', desc: 'Modern tesisler ve dijital altyapıyla yeni bir sayfa açıldı.' },
    ],
    values: [
      { icon: '🏆', title: 'Şampiyonluk Ruhu', desc: 'Her branşta zirveyi hedefleyen azimli bir yapı.' },
      { icon: '🤝', title: 'Toplum Odaklılık', desc: "Üsküdar'ın spor ve sosyal hayatına katkı önceliğimizdir." },
      { icon: '🌱', title: 'Altyapıya Yatırım', desc: 'Gençleri yetiştirmek kulübümüzün temel misyonudur.' },
      { icon: '⚖️', title: 'Fair Play', desc: 'Sporseverliği ve dürüstlüğü her şeyin önünde tutarız.' },
    ],
    board: [
      { name: 'Ahmet Kaya', title: 'Kulüp Başkanı', icon: '👔', image: null },
      { name: 'Mehmet Demir', title: 'Genel Sekreter', icon: '📋', image: null },
      { name: 'Elif Şahin', title: 'Mali Sekreter', icon: '💼', image: null },
      { name: 'Hasan Yıldız', title: 'Teknik Direktör', icon: '⚽', image: null },
    ],
  },
}

function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback } }
function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

function deepMerge(defaults, saved) {
  if (!saved) return defaults
  const result = { ...defaults, ...saved }
  // Obje alanlarını derin birleştir
  for (const key of ['branches', 'about']) {
    if (defaults[key] && saved[key]) {
      result[key] = { ...defaults[key], ...saved[key] }
      if (key === 'branches') {
        for (const b of Object.keys(defaults[key])) {
          result[key][b] = { ...defaults[key][b], ...(saved[key][b] || {}) }
        }
      }
      if (key === 'about') {
        for (const f of ['milestones', 'values', 'board']) {
          if (saved[key][f]) result[key][f] = saved[key][f]
        }
      }
    }
  }
  for (const key of ['stats', 'slides', 'tickerItems']) {
    if (saved[key]) result[key] = saved[key]
  }
  return result
}

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(() => deepMerge(DEFAULT_SETTINGS, load('usk_settings', null)))

  useEffect(() => save('usk_settings', settings), [settings])

  const updateSettings = (data) => setSettings(prev => ({ ...prev, ...data }))
  const updateStat     = (i, data) => setSettings(prev => ({ ...prev, stats: prev.stats.map((s, idx) => idx === i ? { ...s, ...data } : s) }))
  const updateSlide    = (i, data) => setSettings(prev => ({ ...prev, slides: prev.slides.map((s, idx) => idx === i ? { ...s, ...data } : s) }))
  const updateTicker   = (items) => setSettings(prev => ({ ...prev, tickerItems: items }))
  const updateBranch   = (id, data) => setSettings(prev => ({ ...prev, branches: { ...prev.branches, [id]: { ...prev.branches[id], ...data } } }))
  const updateAbout    = (data) => setSettings(prev => ({ ...prev, about: { ...prev.about, ...data } }))

  useEffect(() => {
    document.documentElement.style.setProperty('--green', settings.colorGreen)
    document.documentElement.style.setProperty('--green-dark', settings.colorDark)
    document.documentElement.style.setProperty('--green-light', settings.colorLight)
  }, [settings.colorGreen, settings.colorDark, settings.colorLight])

  const effectiveLogo = settings.logo || '/logo.png'

  return (
    <SiteContext.Provider value={{ settings, updateSettings, updateStat, updateSlide, updateTicker, updateBranch, updateAbout, effectiveLogo }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
