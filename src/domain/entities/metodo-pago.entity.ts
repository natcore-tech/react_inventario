// src/domain/entities/metodo-pago.entity.ts

/**
 * Método de Pago tal como lo devuelve MetodoPagoSerializer de Django.
 *
 * Notas de mapeo:
 *   - `creado_en`      → string  (DateTimeField ISO 8601, read_only)
 *   - `actualizado_en` → string  (DateTimeField ISO 8601, read_only)
 */
export interface MetodoPago {
  id: number
  nombre: string
  es_activo: boolean
  creado_en: string
  actualizado_en: string
}
