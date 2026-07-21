// src/infrastructure/adapters/axios-alerta-stock-minimo.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { AlertaStockMinimoRepository } from '@/domain/ports/alerta-stock-minimo.repository'
import type { AlertaStockMinimo } from '@/domain/entities/alerta-stock-minimo.entity'
import type { CreateAlertaStockMinimoDto } from '@/application/dtos/create-alerta-stock-minimo.dto'
import type { UpdateAlertaStockMinimoDto } from '@/application/dtos/update-alerta-stock-minimo.dto'

/** Forma real de la respuesta paginada de DRF (confirmado en /numeros-serie/). */
interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export class AxiosAlertaStockMinimoRepository implements AlertaStockMinimoRepository {
  async getAlertas(): Promise<AlertaStockMinimo[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<AlertaStockMinimo>>('/alertas-stock/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createAlerta(dto: CreateAlertaStockMinimoDto): Promise<AlertaStockMinimo> {
    try {
      const { data } = await apiClient.post<AlertaStockMinimo>('/alertas-stock/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateAlerta(id: number, dto: UpdateAlertaStockMinimoDto): Promise<AlertaStockMinimo> {
    try {
      const { data } = await apiClient.patch<AlertaStockMinimo>(`/alertas-stock/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async deleteAlerta(id: number): Promise<void> {
    try {
      await apiClient.delete(`/alertas-stock/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}