// Ruta: src/infrastructure/adapters/axios-orden-compra.repository.ts

import { apiClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'
import type { OrdenCompraRepository } from '../../domain/ports/orden-compra.repository'
import type { OrdenCompra, EstadoOrdenCompra } from '../../domain/entities/orden-compra.entity'

// IMPORTANTE (aprendido con Proveedor): baseURL de apiClient ya incluye "/api",
// asi que aqui NO se repite. Ruta real: /api/ordenes-compra/
const BASE_URL = '/ordenes-compra/'

type ListResponse<T> = T[] | { count: number; next: string | null; previous: string | null; results: T[] }

function extractResults<T>(data: ListResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results
}

type CreateOrdenCompraPayload = Parameters<OrdenCompraRepository['createOrdenCompra']>[0]

export class AxiosOrdenCompraRepository implements OrdenCompraRepository {
  async getOrdenesCompra(): Promise<OrdenCompra[]> {
    try {
      const { data } = await apiClient.get<ListResponse<OrdenCompra>>(BASE_URL)
      return extractResults(data)
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async getOrdenCompra(id: number): Promise<OrdenCompra> {
    try {
      const { data } = await apiClient.get<OrdenCompra>(`${BASE_URL}${id}/`)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async createOrdenCompra(payload: CreateOrdenCompraPayload): Promise<OrdenCompra> {
    try {

      const { data } = await apiClient.post<OrdenCompra>(BASE_URL, payload)
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  async cambiarEstadoOrdenCompra(id: number, estado: EstadoOrdenCompra): Promise<OrdenCompra> {
    try {
      const { data } = await apiClient.patch<OrdenCompra>(`${BASE_URL}${id}/`, { estado })
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}