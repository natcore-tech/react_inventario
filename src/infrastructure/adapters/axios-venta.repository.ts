// src/infrastructure/adapters/axios-venta.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { VentaRepository } from '@/domain/ports/venta.repository'
import type { Venta } from '@/domain/entities/venta.entity'
import type { CreateVentaDto, UpdateVentaDto } from '@/application/dtos/venta.dto'

interface PaginatedVentas {
  count: number
  next: string | null
  previous: string | null
  results: Venta[]
}

export class AxiosVentaRepository implements VentaRepository {
  async getVentas(): Promise<Venta[]> {
    try {
      const { data } = await apiClient.get<PaginatedVentas>('/ventas/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async crearVenta(dto: CreateVentaDto): Promise<Venta> {
    try {
      const { data } = await apiClient.post<Venta>('/ventas/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateVenta(id: number, dto: UpdateVentaDto): Promise<Venta> {
    try {
      const { data } = await apiClient.patch<Venta>(`/ventas/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
