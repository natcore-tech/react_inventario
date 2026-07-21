// src/application/dtos/categoria.dto.ts

export interface CreateCategoriaDto {
  nombre: string
  slug: string
  descripcion?: string
  activa?: boolean
}

export type UpdateCategoriaDto = Partial<CreateCategoriaDto>
