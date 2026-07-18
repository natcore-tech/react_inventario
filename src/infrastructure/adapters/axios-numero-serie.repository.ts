// src/infrastructure/adapters/axios-numero-serie.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { NumeroSerieRepository } from '@/domain/ports/numero-serie.repository'
import type { NumeroSerie } from '@/domain/entities/numero-serie.entity'
import type { CreateNumeroSerieDto } from '@/application/dtos/create-numero-serie.dto'
import type { UpdateNumeroSerieDto } from '@/application/dtos/update-numero-serie.dto'

export class AxiosNumeroSerieRepository implements NumeroSerieRepository {
  async getNumerosSerie(): Promise<NumeroSerie[]> {
    try {
      const { data } = await apiClient.get<NumeroSerie[]>('/numeros-serie/')
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createNumeroSerie(dto: CreateNumeroSerieDto): Promise<NumeroSerie> {
    try {
      const { data } = await apiClient.post<NumeroSerie>('/numeros-serie/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateNumeroSerie(id: number, dto: UpdateNumeroSerieDto): Promise<NumeroSerie> {
    try {
      const { data } = await apiClient.patch<NumeroSerie>(`/numeros-serie/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async deleteNumeroSerie(id: number): Promise<void> {
    try {
      await apiClient.delete(`/numeros-serie/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}