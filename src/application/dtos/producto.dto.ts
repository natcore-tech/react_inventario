// src/application/dtos/producto.dto.ts

/**
 * Datos requeridos para CREAR un producto.
 * Mapea los campos write del SerializerProducto de Django.
 *   - `precio`       → number  (DRF acepta números para DecimalField)
 *   - `categoria_id` → number  (PrimaryKeyRelatedField write_only)
 */
export interface CreateProductoDto {
  nombre: string
  descripcion: string
  precio: number
  stock: number
  es_activo: boolean
  categoria_id: number
  image?: File | null
}

/**
 * Datos para ACTUALIZAR un producto (PATCH).
 * Todos los campos son opcionales.
 */
export type UpdateProductoDto = Partial<CreateProductoDto>
