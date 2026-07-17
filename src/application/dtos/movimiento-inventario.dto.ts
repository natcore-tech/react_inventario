// src/application/dtos/movimiento-inventario.dto.ts
import type { TipoMovimiento } from '@/domain/entities/movimiento-inventario.entity'

/**
 * Datos requeridos para CREAR un Movimiento de Inventario.
 * Si el tipo es 'ENTRADA', el proveedor es obligatorio.
 */
export interface CreateMovimientoInventarioDto {
  producto: number
  tipo: TipoMovimiento
  cantidad: number
  motivo?: string
  proveedor?: number | null
}
