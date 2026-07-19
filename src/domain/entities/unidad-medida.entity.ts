// src/domain/entities/unidad-medida.entity.ts

/**
 * Entidad de dominio para UnidadMedida.
 * Refleja exactamente los campos expuestos por UnidadMedidaSerializer:
 *   fields = ['id', 'nombre', 'abreviatura', 'descripcion_completa']
 */
export interface UnidadMedida {
  id: number
  nombre: string
  abreviatura: string
  /** Campo calculado: "Kilogramo (kg)" — generado por get_descripcion_completa en DRF. */
  descripcion_completa: string
}
