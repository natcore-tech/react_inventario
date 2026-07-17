// src/domain/entities/proveedor.entity.ts

/**
 * Entidad mínima de Proveedor para ser utilizada en los Movimientos de Inventario.
 * Se expandirá cuando se desarrolle el módulo completo de Compras.
 */
export interface Proveedor {
  id: number
  nombre: string
  es_activo: boolean
}
