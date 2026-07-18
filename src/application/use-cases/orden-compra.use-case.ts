// Ruta: src/application/use-cases/orden-compra.use-case.ts

import type { OrdenCompraRepository } from '../../domain/ports/orden-compra.repository'
import type { OrdenCompra } from '../../domain/entities/orden-compra.entity'
import type { CreateOrdenCompraDto } from '../dtos/create-orden-compra.dto'

export class OrdenCompraUseCase {
  constructor(private readonly ordenCompraRepository: OrdenCompraRepository) {}

  getOrdenesCompra(): Promise<OrdenCompra[]> {
    return this.ordenCompraRepository.getOrdenesCompra()
  }

  getOrdenCompra(id: number): Promise<OrdenCompra> {
    return this.ordenCompraRepository.getOrdenCompra(id)
  }

  createOrdenCompra(dto: CreateOrdenCompraDto): Promise<OrdenCompra> {
    // El total_estimado se calcula aqui, no se confia en que el frontend
    // lo mande "bien calculado" desde el form.
    const totalEstimado = dto.detalles.reduce(
      (acumulado, item) => acumulado + item.cantidad * item.precio_unitario_compra,
      0,
    )

    return this.ordenCompraRepository.createOrdenCompra({
      codigo_orden: dto.codigo_orden,
      proveedor: dto.proveedor,
      total_estimado: totalEstimado,
      detalles: dto.detalles,
    })
  }

  marcarComoRecibida(id: number): Promise<OrdenCompra> {
    return this.ordenCompraRepository.cambiarEstadoOrdenCompra(id, 'RECIBIDA')
  }

  cancelarOrden(id: number): Promise<OrdenCompra> {
    return this.ordenCompraRepository.cambiarEstadoOrdenCompra(id, 'CANCELADA')
  }
}