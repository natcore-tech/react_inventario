// src/infrastructure/factories/producto.factory.ts
import { AxiosProductoRepository } from '@/infrastructure/adapters/axios-producto.repository'
import { ProductoUseCase } from '@/application/use-cases/producto.use-case'

/**
 * Instancia única del caso de uso de Producto, ya conectada a su
 * implementación concreta (AxiosProductoRepository). El resto de la app importa
 * `productoUseCase` y nunca instancia ProductoUseCase ni AxiosProductoRepository directamente.
 */
export const productoUseCase = new ProductoUseCase(new AxiosProductoRepository())
