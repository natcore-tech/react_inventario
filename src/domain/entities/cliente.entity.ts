// src/domain/entities/cliente.entity.ts

/**
 * Cliente tal como lo devuelve ClienteSerializer de Django.
 *
 * Notas de mapeo:
 *   - `email`          → string | null  (EmailField con null=True)
 *   - `telefono`       → string         (blank=True sin null=True → cadena vacía posible)
 *   - `direccion`      → string         (blank=True sin null=True → cadena vacía posible)
 *   - `total_compras`  → number         (SerializerMethodField, retorna int)
 *   - `creado_en`      → string         (DateTimeField ISO 8601, read_only)
 *   - `actualizado_en` → string         (DateTimeField ISO 8601, read_only)
 */
export interface Cliente {
  id: number
  identificacion: string
  nombres: string
  email: string | null
  telefono: string
  direccion: string
  es_activo: boolean
  total_compras: number
  creado_en: string
  actualizado_en: string
}
