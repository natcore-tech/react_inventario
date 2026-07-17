// src/domain/entities/categoria.entity.ts

/**
 * Categoría tal como la devuelve CategoriaSerializer de Django.
 *
 * Notas de mapeo:
 *   - `descripcion`      → string   (blank=True, default='' → nunca null)
 *   - `total_productos`  → number   (SerializerMethodField → int)
 *   - `creado_en`        → string   (DateTimeField ISO 8601, read_only)
 */
export interface Categoria {
  id: number
  nombre: string
  slug: string
  descripcion: string
  activa: boolean
  total_productos: number
  creado_en: string
}
