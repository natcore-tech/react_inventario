// src/domain/entities/bodega.entity.ts

/**
 * Entidad de dominio para Bodega.
 * Refleja exactamente los campos expuestos por BodegaSerializer:
 *   fields = ['id', 'nombre', 'direccion', 'activa']
 */
export interface Bodega {
  id: number
  nombre: string
  /** Dirección de la bodega. Puede ser null si no fue registrada. */
  direccion: string | null
  activa: boolean
}
