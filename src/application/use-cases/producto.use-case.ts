// src/application/use-cases/producto.use-case.ts
import type { ProductoRepository } from '@/domain/ports/producto.repository'
import type { Producto } from '@/domain/entities/producto.entity'
import type { CreateProductoDto, UpdateProductoDto } from '@/application/dtos/producto.dto'

export class ProductoUseCase {
  private readonly productoRepository: ProductoRepository

  constructor(productoRepository: ProductoRepository) {
    this.productoRepository = productoRepository
  }

  /** Devuelve todos los productos del listado paginado. */
  getProductos(): Promise<Producto[]> {
    return this.productoRepository.getProductos()
  }

  /** Crea un nuevo producto. */
  createProducto(dto: CreateProductoDto): Promise<Producto> {
    return this.productoRepository.createProducto(dto)
  }

  /** Actualiza parcialmente un producto existente (PATCH). */
  updateProducto(id: number, dto: UpdateProductoDto): Promise<Producto> {
    return this.productoRepository.updateProducto(id, dto)
  }

  /** Elimina (soft delete) un producto por su id. */
  deleteProducto(id: number): Promise<void> {
    return this.productoRepository.deleteProducto(id)
  }
}
