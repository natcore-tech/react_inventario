// src/presentation/utils/ajuste-tipo-colors.ts
import { colors } from '@/presentation/theme/colors'
import type { TipoAjuste } from '@/domain/entities/ajuste-inventario.entity'

// ROBO = más grave → error/rojo. DANO/CADUCIDAD = advertencia → warning/amarillo.
// ERROR (de conteo) = neutral, no es una pérdida real → gris de icono.
export const TIPO_AJUSTE_COLORS: Record<TipoAjuste, { bg: string; text: string }> = {
  ROBO: { bg: colors.error, text: colors.foreground },
  DANO: { bg: colors.warning, text: colors.background },
  CADUCIDAD: { bg: colors.warning, text: colors.background },
  ERROR: { bg: colors.mutedForeground, text: colors.background },
}

export function getCantidadColor(cantidad: number): string {
  return cantidad > 0 ? colors.success : colors.error
}

export function formatCantidadSigno(cantidad: number): string {
  return cantidad > 0 ? `+${cantidad}` : `${cantidad}`
}