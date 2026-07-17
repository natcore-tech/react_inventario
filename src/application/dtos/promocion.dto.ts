// src/application/dtos/promocion.dto.ts

/**
 * Datos requeridos para CREAR una promoción.
 * Mapea los campos write del PromocionSerializer de Django.
 *   - `producto`              → number | null  (FK opcional; null = promoción general)
 *   - `porcentaje_descuento`  → number         (DRF acepta número para DecimalField, rango 0.01-100)
 *   - `fecha_inicio`          → string         ("YYYY-MM-DD")
 *   - `fecha_fin`             → string         ("YYYY-MM-DD")
 */
export interface CreatePromocionDto {
  nombre: string
  producto: number | null
  porcentaje_descuento: number
  fecha_inicio: string
  fecha_fin: string
  es_activa: boolean
}

/**
 * Datos para ACTUALIZAR una promoción (PATCH).
 * Todos los campos son opcionales.
 */
export type UpdatePromocionDto = Partial<CreatePromocionDto>
