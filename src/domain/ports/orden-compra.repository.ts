// Ruta: src/domain/ports/orden-compra.repository.ts

import type { OrdenCompra, EstadoOrdenCompra } from '../entities/orden-compra.entity'

export interface OrdenCompraRepository {
  getOrdenesCompra(): Promise<OrdenCompra[]>
  getOrdenCompra(id: number): Promise<OrdenCompra>

  createOrdenCompra(payload: {
    codigo_orden: string
    proveedor: number
    total_estimado: number
    detalles: {
      producto: number
      cantidad: number
      precio_unitario_compra: number
    }[]
  }): Promise<OrdenCompra>

  // Solo permite cambiar el estado (Recibida / Cancelada), segun lo definido:
  // el backend no soporta editar los items de una orden ya creada.
  cambiarEstadoOrdenCompra(id: number, estado: EstadoOrdenCompra): Promise<OrdenCompra>
}