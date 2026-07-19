// src/application/dtos/update-numero-serie.dto.ts
import type { EstadoNumeroSerie } from '@/domain/entities/numero-serie.entity'

export interface UpdateNumeroSerieDto {
  producto?: number
  codigo_serial?: string
  estado?: EstadoNumeroSerie
}