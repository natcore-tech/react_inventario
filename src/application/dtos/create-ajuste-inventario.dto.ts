// src/application/dtos/create-ajuste-inventario.dto.ts
import type { TipoAjuste } from '@/domain/entities/ajuste-inventario.entity'

export interface CreateAjusteInventarioDto {
  producto: number
  tipo_ajuste: TipoAjuste
  cantidad: number
  justificativo: string
}