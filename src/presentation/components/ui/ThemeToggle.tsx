// src/presentation/components/ui/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = saved ? saved === 'dark' : prefersDark
    setIsDark(dark)
    applyTheme(dark)
  }, [])

  function applyTheme(dark: boolean) {
    const root = document.documentElement
    if (dark) root.classList.remove('light')
    else root.classList.add('light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  function toggle() {
    const next = !isDark
    setIsDark(next)
    applyTheme(next)
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className={[
        'relative flex items-center justify-center w-9 h-9 rounded-xl',
        'border border-border/60 bg-muted/30',
        'transition-all duration-300',
        'hover:border-primary/45 hover:bg-primary/8',
        'hover:shadow-[0_0_14px_hsl(var(--primary)/0.25)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        'overflow-hidden',
      ].join(' ')}
    >
      {/* Sun icon */}
      <Sun
        className={[
          'absolute h-4 w-4 text-amber-400 transition-all duration-350',
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100',
        ].join(' ')}
      />
      {/* Moon icon */}
      <Moon
        className={[
          'absolute h-4 w-4 text-primary transition-all duration-350',
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50',
        ].join(' ')}
      />
    </button>
  )
}
