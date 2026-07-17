// src/application/dtos/venta.dto.ts
import type { EstadoVenta } from '@/domain/entities/venta.entity'

export interface CreateVentaDetalleDto {
  producto: number
  cantidad: number
}

export interface CreatePagoVentaDto {
  metodo_pago: number
  monto: number
}

/**
 * Datos requeridos para CREAR una Venta (POST).
 * El backend se encarga de todo el cálculo (precios, subtotal, iva, total)
 * y de asociar el cajero y el turno actual.
 */
export interface CreateVentaDto {
  cliente: number
  detalles: CreateVentaDetalleDto[]
  pagos: CreatePagoVentaDto[]
}

/**
 * Datos para ACTUALIZAR una Venta (PATCH).
 * Principalmente usado para cambiar el estado a ANULADA.
 */
export interface UpdateVentaDto {
  estado?: EstadoVenta
}
