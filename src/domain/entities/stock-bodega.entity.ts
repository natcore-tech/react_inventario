// src/domain/entities/stock-bodega.entity.ts

/**
 * Entidad de dominio para StockBodega.
 * Refleja exactamente los campos expuestos por StockBodegaSerializer:
 *   fields = ['id', 'bodega', 'bodega_nombre', 'producto', 'producto_nombre', 'cantidad']
 *
 * 'bodega' y 'producto' son las FKs (IDs numéricos enviados por DRF).
 * 'bodega_nombre' y 'producto_nombre' son campos de solo lectura derivados de la FK.
 */
export interface StockBodega {
  id: number
  bodega: number
  bodega_nombre: string
  producto: number
  producto_nombre: string
  cantidad: number
}
