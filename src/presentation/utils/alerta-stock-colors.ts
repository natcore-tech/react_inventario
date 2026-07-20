// src/presentation/utils/alerta-stock-colors.ts
import { colors } from '@/presentation/theme/colors'

export function getAlertaEstado(
  stockActual: number,
  cantidadMinima: number,
  activa: boolean,
): { label: string; bg: string; text: string } {
  if (!activa) {
    return { label: 'Inactiva', bg: colors.muted, text: colors.mutedForeground }
  }
  if (stockActual <= cantidadMinima) {
    return { label: 'En alerta', bg: colors.error, text: colors.foreground }
  }
  return { label: 'Normal', bg: colors.success, text: colors.background }
}