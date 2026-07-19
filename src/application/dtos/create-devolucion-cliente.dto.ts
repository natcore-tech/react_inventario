// src/application/dtos/create-devolucion-cliente.dto.ts
import type { EstadoProductoDevolucion } from '@/domain/entities/devolucion-cliente.entity'

export interface CreateDevolucionClienteDto {
  producto: number
  cantidad: number
  motivo: string
  estado_producto?: EstadoProductoDevolucion
}