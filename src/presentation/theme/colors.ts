// src/presentation/theme/colors.ts

/**
 * Paleta de colores semánticos adaptada del AppTheme.
 * Usados cuando se necesita un valor JS (canvas, charts, etc.).
 * Para clases Tailwind usar directamente: text-primary, bg-surface, etc.
 */
export const colors = {
  // ── Paleta Base de UI ───────────────────────────────────────
  primary: 'hsl(277.6 78.9% 57.5%)',         // accent
  primaryForeground: 'hsl(0 0% 100%)',       // onAccent
  secondary: 'hsl(0 0% 23.9%)',              // surface2
  muted: 'hsl(0 0% 23.9%)',                  // surface2
  mutedForeground: 'hsl(0 0% 74.1%)',        // textSecondary
  accentDark: 'hsl(271.2 76.1% 52.9%)',      // accentDark (Hover states)
  
  // ── Fondos y Estructura ──────────────────────────────────────
  background: 'hsl(0 0% 7.1%)',              // background (#121212)
  card: 'hsl(0 0% 16.9%)',                   // surface (#2B2B2B)
  border: 'hsl(0 0% 25.9%)',                 // border (#424242)
  borderLight: 'hsl(0 0% 32.5%)',            // borderLight (#535353)
  foreground: 'hsl(0 0% 100%)',              // textPrimary (#FFFFFF)

  // ── Estados y Alertas ────────────────────────────────────────
  success: 'hsl(135.1 58.7% 49.2%)',         // #34C759
  error: 'hsl(5.6 78.4% 57.1%)',             // #E74C3C
  warning: 'hsl(44.2 89.2% 60.8%)',          // #F4C542
  info: 'hsl(204.1 69.9% 53.1%)',            // #3498DB
} as const