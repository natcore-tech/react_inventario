// src/presentation/hooks/useCounter.ts
import { useEffect, useRef, useState } from 'react'

/**
 * Animated numeric counter that starts when the element enters the viewport.
 * Returns { count, ref } — attach `ref` to any HTML element.
 */
export function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const fps = 60
          const steps = Math.round((duration / 1000) * fps)
          let step = 0
          const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

          const timer = setInterval(() => {
            step++
            const progress = easeOut(step / steps)
            const current = Math.round(progress * target)
            setCount(current)
            if (step >= steps) {
              setCount(target)
              clearInterval(timer)
            }
          }, 1000 / fps)

          observer.unobserve(el)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}
