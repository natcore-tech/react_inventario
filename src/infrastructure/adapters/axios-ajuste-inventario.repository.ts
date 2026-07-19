// src/infrastructure/adapters/axios-ajuste-inventario.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { AjusteInventarioRepository } from '@/domain/ports/ajuste-inventario.repository'
import type { AjusteInventario } from '@/domain/entities/ajuste-inventario.entity'
import type { CreateAjusteInventarioDto } from '@/application/dtos/create-ajuste-inventario.dto'
import type { UpdateAjusteInventarioDto } from '@/application/dtos/update-ajuste-inventario.dto'

/** Forma real de la respuesta paginada de DRF (confirmado en /numeros-serie/). */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export class AxiosAjusteInventarioRepository implements AjusteInventarioRepository {
  async getAjustes(): Promise<AjusteInventario[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<AjusteInventario>>('/ajustes-inventario/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createAjuste(dto: CreateAjusteInventarioDto): Promise<AjusteInventario> {
    try {
      const { data } = await apiClient.post<AjusteInventario>('/ajustes-inventario/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateAjuste(id: number, dto: UpdateAjusteInventarioDto): Promise<AjusteInventario> {
    try {
      const { data } = await apiClient.patch<AjusteInventario>(`/ajustes-inventario/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}