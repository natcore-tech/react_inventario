// Ruta: src/infrastructure/adapters/axios-proveedor.repository.ts
// Nota: asume que tu compañero ya tiene creados:
//   - src/infrastructure/http/axios-client.ts   -> exporta `apiClient` (instancia de Axios configurada)
//   - src/infrastructure/http/parse-api-error.ts -> exporta `parseApiError(err)` que arma un ApiException
// Si esos exports tienen otro nombre, ajusta los imports de abajo.

import { apiClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'
import type { ProveedorRepository } from '../../domain/ports/proveedor.repository'
import type { Proveedor } from '../../domain/entities/proveedor.entity'

const BASE_URL = '/api/proveedores/'

// DRF a veces pagina ({ count, next, previous, results }) y a veces no (array plano).
type ListResponse<T> = T[] | { count: number; next: string | null; previous: string | null; results: T[] }

function extractResults<T>(data: ListResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results
}

type CreateProveedorPayload = Parameters<ProveedorRepository['createProveedor']>[0]
type UpdateProveedorPayload = Parameters<ProveedorRepository['updateProveedor']>[1]

export class AxiosProveedorRepository implements ProveedorRepository {
  async getProveedores(): Promise<Proveedor[]> {
    try {
      const { data } = await apiClient.get<ListResponse<Proveedor>>(BASE_URL)
      return extractResults(data)
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async getProveedor(id: number): Promise<Proveedor> {
    try {
      const { data } = await apiClient.get<Proveedor>(`${BASE_URL}${id}/`)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createProveedor(payload: CreateProveedorPayload): Promise<Proveedor> {
    try {
      const { data } = await apiClient.post<Proveedor>(BASE_URL, payload)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async updateProveedor(id: number, payload: UpdateProveedorPayload): Promise<Proveedor> {
    try {
      const { data } = await apiClient.patch<Proveedor>(`${BASE_URL}${id}/`, payload)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async deleteProveedor(id: number): Promise<void> {
    try {
      await apiClient.delete(`${BASE_URL}${id}/`)
    } catch (err) {
      throw parseApiError(err)
    }
  }
}