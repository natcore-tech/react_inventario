// src/domain/entities/ubicacion-fisica.entity.ts

/**
 * Entidad de dominio para UbicacionFisica.
 * Refleja exactamente los campos expuestos por UbicacionFisicaSerializer:
 *   fields = ['id', 'pasillo', 'estante', 'coordenada_exacta']
 * Nota: el campo 'nivel' existe en el modelo pero NO está en los fields del serializer.
 */
export interface UbicacionFisica {
  id: number
  pasillo: string
  estante: string
  /** Campo calculado: "PASILLO A - ESTANTE 4" — generado por get_coordenada_exacta en DRF. */
  coordenada_exacta: string
}
