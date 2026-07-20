// src/domain/entities/venta.entity.ts

export type EstadoVenta = 'EMITIDA' | 'PAGADA' | 'ANULADA'

export interface VentaDetalle {
  id: number
  producto: number
  nombre_producto: string
  cantidad: number
  precio_unitario_venta: string // Decimal devuelto como string
  subtotal_linea: string        // Decimal devuelto como string
}

export interface PagoVenta {
  id: number
  metodo_pago: number
  nombre_metodo: string
  monto: string // Decimal devuelto como string
  fecha_pago: string
}

export interface Venta {
  id: number
  cliente: number
  nombre_cliente: string
  cajero: number
  nombre_cajero: string
  turno: number
  fecha_emision: string
  subtotal: string
  iva: string
  total: string
  estado: EstadoVenta
  detalles: VentaDetalle[]
  pagos: PagoVenta[]
}
