// src/domain/ports/venta.repository.ts
import type { Venta } from '../entities/venta.entity'
import type { CreateVentaDto, UpdateVentaDto } from '@/application/dtos/venta.dto'

export interface VentaRepository {
  /** GET /ventas/ — Devuelve la lista paginada de ventas. */
  getVentas(): Promise<Venta[]>
  
  /** POST /ventas/ — Registra una nueva venta con sus detalles y pagos. */
  crearVenta(dto: CreateVentaDto): Promise<Venta>
  
  /** PATCH /ventas/:id/ — Actualiza una venta (usado principalmente para ANULAR). */
  updateVenta(id: number, dto: UpdateVentaDto): Promise<Venta>
}
