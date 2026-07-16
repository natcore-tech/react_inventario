// src/application/use-cases/producto.use-case.ts
import type { ProductoRepository } from '@/domain/ports/producto.repository'
import type { Producto } from '@/domain/entities/producto.entity'

export class ProductoUseCase {
  private readonly productoRepository: ProductoRepository

  constructor(productoRepository: ProductoRepository) {
    this.productoRepository = productoRepository
  }

  /** Devuelve todos los productos del listado paginado. */
  getProductos(): Promise<Producto[]> {
    return this.productoRepository.getProductos()
  }
}
