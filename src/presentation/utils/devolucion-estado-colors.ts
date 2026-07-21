// src/presentation/utils/devolucion-estado-colors.ts
import { colors } from '@/presentation/theme/colors'
import type { EstadoProductoDevolucion } from '@/domain/entities/devolucion-cliente.entity'

export const ESTADO_DEVOLUCION_COLORS: Record<EstadoProductoDevolucion, { bg: string; text: string }> = {
  BUENO: { bg: colors.success, text: colors.background },
  DANO: { bg: colors.error, text: colors.foreground },
  USADO: { bg: colors.warning, text: colors.background },
}