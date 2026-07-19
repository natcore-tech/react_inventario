// src/domain/entities/movimiento-inventario.entity.ts

export type TipoMovimiento = 'ENTRADA' | 'SALIDA' | 'AJUSTE_POS' | 'AJUSTE_NEG'

export interface MovimientoInventario {
  id: number
  producto: number
  producto_nombre: string
  producto_categoria: string
  proveedor: number | null
  proveedor_nombre: string | null
  tipo: TipoMovimiento
  tipo_display: string
  cantidad: number
  motivo: string
  usuario: string
  creado_en: string
}
