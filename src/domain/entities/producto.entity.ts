// src/domain/entities/producto.entity.ts

/**
 * Subconjunto de Categoría tal como lo devuelve el CategoriaSerializer
 * anidado dentro de SerializerProducto (campo `categoria`, read_only).
 * Se tipará de forma completa cuando se implemente la entidad Categoria.
 */
export interface CategoriaResumen {
  id: number
  nombre: string
}

/**
 * Producto completo tal como lo devuelve SerializerProducto de Django.
 *
 * Notas de mapeo:
 *   - `precio`              → string  (DecimalField serializado como cadena por DRF)
 *   - `precio_con_impuesto` → number  (SerializerMethodField, retorna float)
 *   - `en_stock`            → boolean (SerializerMethodField: stock > 0)
 *   - `categoria_id`        → write_only en Django, NO aparece en respuestas GET
 */
export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio: string
  precio_con_impuesto: number
  stock: number
  en_stock: boolean
  es_activo: boolean
  categoria: CategoriaResumen
}
