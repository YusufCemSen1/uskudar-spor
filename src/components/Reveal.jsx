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

  const dirClass = {
    up:    'rv rv-up',
    down:  'rv rv-down',
    left:  'rv rv-left',
    right: 'rv rv-right',
    scale: 'rv rv-scale',
    none:  'rv',
  }[direction] ?? 'rv rv-up'

  return (
    <div ref={ref} className={`${dirClass} ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}>
      {children}
    </div>
  )
}
