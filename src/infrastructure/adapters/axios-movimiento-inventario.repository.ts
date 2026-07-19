// src/infrastructure/adapters/axios-movimiento-inventario.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { MovimientoInventarioRepository } from '@/domain/ports/movimiento-inventario.repository'
import type { MovimientoInventario } from '@/domain/entities/movimiento-inventario.entity'
import type { CreateMovimientoInventarioDto } from '@/application/dtos/movimiento-inventario.dto'

interface PaginatedMovimientos {
  count: number
  next: string | null
  previous: string | null
  results: MovimientoInventario[]
}

export class AxiosMovimientoInventarioRepository implements MovimientoInventarioRepository {
  async getMovimientos(): Promise<MovimientoInventario[]> {
    try {
      const { data } = await apiClient.get<PaginatedMovimientos>('/movimientos/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async crearMovimiento(dto: CreateMovimientoInventarioDto): Promise<MovimientoInventario> {
    try {
      const { data } = await apiClient.post<MovimientoInventario>('/movimientos/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
