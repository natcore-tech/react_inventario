// src/application/use-cases/movimiento-inventario.use-case.ts
import type { MovimientoInventarioRepository } from '@/domain/ports/movimiento-inventario.repository'
import type { MovimientoInventario } from '@/domain/entities/movimiento-inventario.entity'
import type { CreateMovimientoInventarioDto } from '@/application/dtos/movimiento-inventario.dto'

export class MovimientoInventarioUseCase {
  private readonly repository: MovimientoInventarioRepository

  constructor(repository: MovimientoInventarioRepository) {
    this.repository = repository
  }

  getMovimientos(): Promise<MovimientoInventario[]> {
    return this.repository.getMovimientos()
  }

  crearMovimiento(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventario> {
    return this.repository.crearMovimiento(dto)
  }
}
