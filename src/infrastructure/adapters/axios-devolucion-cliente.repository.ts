// src/infrastructure/adapters/axios-devolucion-cliente.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { DevolucionClienteRepository } from '@/domain/ports/devolucion-cliente.repository'
import type { DevolucionCliente } from '@/domain/entities/devolucion-cliente.entity'
import type { CreateDevolucionClienteDto } from '@/application/dtos/create-devolucion-cliente.dto'
import type { UpdateDevolucionClienteDto } from '@/application/dtos/update-devolucion-cliente.dto'

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export class AxiosDevolucionClienteRepository implements DevolucionClienteRepository {
  async getDevoluciones(): Promise<DevolucionCliente[]> {
    try {
      const { data } = await apiClient.get<PaginatedResponse<DevolucionCliente>>('/devoluciones/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createDevolucion(dto: CreateDevolucionClienteDto): Promise<DevolucionCliente> {
    try {
      const { data } = await apiClient.post<DevolucionCliente>('/devoluciones/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateDevolucion(id: number, dto: UpdateDevolucionClienteDto): Promise<DevolucionCliente> {
    try {
      const { data } = await apiClient.patch<DevolucionCliente>(`/devoluciones/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}