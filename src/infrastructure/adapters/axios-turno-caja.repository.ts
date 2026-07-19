// src/infrastructure/adapters/axios-turno-caja.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { TurnoCajaRepository } from '@/domain/ports/turno-caja.repository'
import type { TurnoCaja } from '@/domain/entities/turno-caja.entity'
import type { CreateTurnoCajaDto, CloseTurnoCajaDto } from '@/application/dtos/turno-caja.dto'

interface PaginatedTurnos {
  count: number
  next: string | null
  previous: string | null
  results: TurnoCaja[]
}

export class AxiosTurnoCajaRepository implements TurnoCajaRepository {
  async getTurnosCaja(): Promise<TurnoCaja[]> {
    try {
      // Usamos el endpoint estándar que DRF genera para el viewset TurnoCajaViewSet
      const { data } = await apiClient.get<PaginatedTurnos>('/turnos-caja/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async abrirTurno(dto: CreateTurnoCajaDto): Promise<TurnoCaja> {
    try {
      const { data } = await apiClient.post<TurnoCaja>('/turnos-caja/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async cerrarTurno(id: number, dto: CloseTurnoCajaDto): Promise<TurnoCaja> {
    try {
      const { data } = await apiClient.patch<TurnoCaja>(`/turnos-caja/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
