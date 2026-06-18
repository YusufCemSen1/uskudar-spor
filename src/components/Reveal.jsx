import { useEffect, useRef } from 'react'

export default function Reveal({ children, className = '', style = {}, delay = 0, direction = 'up', threshold = 0.1 }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('rv-visible'); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Mobilde yatay animasyonlar overflow yapar → up'a çevir
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const safeDir = isMobile && (direction === 'left' || direction === 'right') ? 'up' : direction

  const dirClass = {
    up:    'rv rv-up',
    down:  'rv rv-down',
    left:  'rv rv-left',
    right: 'rv rv-right',
    scale: 'rv rv-scale',
    none:  'rv',
  }[safeDir] ?? 'rv rv-up'

  return (
    <div ref={ref} className={`${dirClass} ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}>
      {children}
    </div>
  )
}
