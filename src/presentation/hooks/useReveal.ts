// src/presentation/hooks/useReveal.ts
import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, adds the 'visible' class
 * which triggers the CSS reveal animation defined in index.css.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}
