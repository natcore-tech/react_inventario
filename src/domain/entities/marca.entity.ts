// src/domain/entities/marca.entity.ts

/**
 * Entidad de dominio para Marca.
 * Refleja exactamente los campos expuestos por MarcaSerializer:
 *   fields = ['id', 'nombre']
 */
export interface Marca {
  id: number
  nombre: string
}
