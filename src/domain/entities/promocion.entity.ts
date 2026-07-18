// src/domain/entities/promocion.entity.ts

/**
 * Promoción tal como la devuelve PromocionSerializer de Django.
 *
 * Notas de mapeo:
 *   - `producto`             → number | null   (FK serializada como ID entero; null=True)
 *   - `nombre_producto`      → string | null   (source='producto.nombre'; null cuando producto es null)
 *   - `porcentaje_descuento` → string          (DecimalField serializado como cadena por DRF)
 *   - `fecha_inicio`         → string          (DateField → "YYYY-MM-DD")
 *   - `fecha_fin`            → string          (DateField → "YYYY-MM-DD")
 *   - `creado_en`            → string          (DateTimeField ISO 8601, read_only)
 */
export interface Promocion {
  id: number
  nombre: string
  producto: number | null
  nombre_producto: string | null
  porcentaje_descuento: string
  fecha_inicio: string
  fecha_fin: string
  es_activa: boolean
  creado_en: string
}
