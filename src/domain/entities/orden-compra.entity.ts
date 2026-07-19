// Ruta: src/domain/entities/orden-compra.entity.ts

export type EstadoOrdenCompra = 'PENDIENTE' | 'RECIBIDA' | 'CANCELADA'

export interface DetalleCompra {
  id: number
  producto: number
  producto_nombre: string
  cantidad: number
  precio_unitario_compra: string // DRF DecimalField serializa como string, ej "150.00"
}

export interface OrdenCompra {
  id: number
  codigo_orden: string
  proveedor: number
  proveedor_nombre: string
  usuario: string
  estado: EstadoOrdenCompra
  estado_display: string
  total_estimado: string // idem, viene como string desde DRF
  detalles: DetalleCompra[]
  creado_en: string
}