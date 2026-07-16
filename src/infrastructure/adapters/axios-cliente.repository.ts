// src/infrastructure/adapters/axios-cliente.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { ClienteRepository } from '@/domain/ports/cliente.repository'
import type { Cliente } from '@/domain/entities/cliente.entity'

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
}
