// src/domain/ports/producto.repository.ts
import type { Producto } from '../entities/producto.entity'
import type { CreateProductoDto, UpdateProductoDto } from '@/application/dtos/producto.dto'

/**
 * Contrato de acceso a datos de Producto.
 * Implementado por infrastructure/adapters/axios-producto.repository.ts
 */
export interface ProductoRepository {
  /** GET /productos/ — Devuelve la lista paginada de productos. */
  getProductos(): Promise<Producto[]>
  /** POST /productos/ — Crea un nuevo producto y devuelve el objeto creado. */
  createProducto(dto: CreateProductoDto): Promise<Producto>
  /** PATCH /productos/:id/ — Actualiza parcialmente un producto. */
  updateProducto(id: number, dto: UpdateProductoDto): Promise<Producto>
  /** DELETE /productos/:id/ — Elimina (soft delete) un producto. */
  deleteProducto(id: number): Promise<void>
}
