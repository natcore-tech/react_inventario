// src/infrastructure/adapters/axios-cliente.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { ClienteRepository } from '@/domain/ports/cliente.repository'
import type { Cliente } from '@/domain/entities/cliente.entity'
import type { CreateClienteDto, UpdateClienteDto } from '@/application/dtos/cliente.dto'

/** Forma de la respuesta paginada de DRF para /clientes/ */
interface PaginatedClientes {
  count: number
  next: string | null
  previous: string | null
  results: Cliente[]
}

export class AxiosClienteRepository implements ClienteRepository {
  /** GET /clientes/ — Extrae los datos de `.results` de la respuesta paginada de DRF. */
  async getClientes(): Promise<Cliente[]> {
    try {
      const { data } = await apiClient.get<PaginatedClientes>('/clientes/')
      return data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** POST /clientes/ — Crea un nuevo cliente. */
  async createCliente(dto: CreateClienteDto): Promise<Cliente> {
    try {
      const { data } = await apiClient.post<Cliente>('/clientes/', dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /clientes/:id/ — Actualiza parcialmente un cliente. */
  async updateCliente(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    try {
      const { data } = await apiClient.patch<Cliente>(`/clientes/${id}/`, dto)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** DELETE /clientes/:id/ — El backend aplica soft delete (es_activo = false). */
  async deleteCliente(id: number): Promise<void> {
    try {
      await apiClient.delete(`/clientes/${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
