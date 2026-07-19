// src/domain/entities/devolucion-cliente.entity.ts

export type EstadoProductoDevolucion = 'BUENO' | 'DANO' | 'USADO'

export const ESTADO_PRODUCTO_DEVOLUCION_LABELS: Record<EstadoProductoDevolucion, string> = {
  BUENO: 'Buen Estado',
  DANO: 'Dañado',
  USADO: 'Usado',
}

export interface DevolucionCliente {
  id: number
  producto: number
  fecha_devolucion: string
  motivo: string
  cantidad: number
  estado_producto: EstadoProductoDevolucion
}