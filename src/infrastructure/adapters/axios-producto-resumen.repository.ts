// Ruta: src/infrastructure/adapters/axios-producto-resumen.repository.ts
// Nota: SOLO lectura, para poblar el <select> de productos en el detalle de
// la orden de compra. Si tu companero ya tiene un modulo completo de
// productos (entity + store), usa ese en su lugar y borra este archivo.

import { apiClient } from '../http/axios-client'
import { parseApiError } from '../http/parse-api-error'
import type { ProductoResumen } from '../../domain/entities/producto-resumen.entity'

const BASE_URL = '/productos/'

type ListResponse<T> = T[] | { count: number; next: string | null; previous: string | null; results: T[] }

function extractResults<T>(data: ListResponse<T>): T[] {
  return Array.isArray(data) ? data : data.results
}

export async function getProductosResumen(): Promise<ProductoResumen[]> {
  try {
    const { data } = await apiClient.get<ListResponse<ProductoResumen>>(BASE_URL)
    return extractResults(data)
  } catch (err) {
    throw parseApiError(err)
  }
}