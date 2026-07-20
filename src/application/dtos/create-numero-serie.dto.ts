// src/application/dtos/create-numero-serie.dto.ts
import type { EstadoNumeroSerie } from '@/domain/entities/numero-serie.entity'

export interface CreateNumeroSerieDto {
  producto: number
  codigo_serial: string
  estado?: EstadoNumeroSerie
}