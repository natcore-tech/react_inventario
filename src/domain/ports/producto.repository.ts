// src/domain/ports/producto.repository.ts
import type { Producto } from '../entities/producto.entity'

/**
 * Contrato de acceso a datos de Producto.
 * Implementado por infrastructure/adapters/axios-producto.repository.ts
 */
export interface ProductoRepository {
  /** GET /productos/ — Devuelve la lista paginada de productos. */
  getProductos(): Promise<Producto[]>
}
