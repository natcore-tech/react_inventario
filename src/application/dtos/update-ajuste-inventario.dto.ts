// src/application/dtos/update-ajuste-inventario.dto.ts
import type { TipoAjuste } from '@/domain/entities/ajuste-inventario.entity'

export interface UpdateAjusteInventarioDto {
  tipo_ajuste?: TipoAjuste
  justificativo?: string
}