// src/domain/ports/movimiento-inventario.repository.ts
import type { MovimientoInventario } from '../entities/movimiento-inventario.entity'
import type { CreateMovimientoInventarioDto } from '@/application/dtos/movimiento-inventario.dto'

export interface MovimientoInventarioRepository {
  /** GET /movimientos/ — Devuelve la lista paginada. */
  getMovimientos(): Promise<MovimientoInventario[]>
  
  /** POST /movimientos/ — Registra un nuevo movimiento. */
  crearMovimiento(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventario>
}
