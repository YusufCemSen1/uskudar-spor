import { useEffect } from 'react'

const MESSAGES = [
  '🏆 Üsküdar Anadolu SK',
  '⚽ Maça hazır mısın?',
  '🏀 Kadın takımı zirvede!',
  '🛍️ Yeni sezon ürünleri',
  '1908\'den beri şampiyonuz',
  '🏐 Voleybol kupası yolda!',
  '🎽 Forma kapmak için tıkla',
  '🏓 Masa tenisinde şampiyonuz!',
  '⭐ Üye ol, ayrıcalığı yakala',
]

export function useTabTitle() {
  useEffect(() => {
    let idx = 0
    const normal = 'Üsküdar Anadolu Spor Kulübü'

    // Sekme gizlenince ilgi çekici mesaj göster
    const onVisibility = () => {
      if (document.hidden) {
        idx = (idx + 1) % MESSAGES.length
        document.title = MESSAGES[idx]
      } else {
        document.title = normal
      }
    }

    // Her 5 saniyede sekme başlığını değiştir (sekme gizliyken)
    const interval = setInterval(() => {
      if (document.hidden) {
        idx = (idx + 1) % MESSAGES.length
        document.title = MESSAGES[idx]
      }
    }, 5000)

    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
      document.title = normal
    }
  }, [])
}
