// src/domain/ports/numero-serie.repository.ts
import type { NumeroSerie } from '../entities/numero-serie.entity'
import type { CreateNumeroSerieDto } from '@/application/dtos/create-numero-serie.dto'
import type { UpdateNumeroSerieDto } from '@/application/dtos/update-numero-serie.dto'


export interface NumeroSerieRepository {
  /** GET /numeros-serie/ — Devuelve la lista completa (sin paginar). */
  getNumerosSerie(): Promise<NumeroSerie[]>
  /** POST /numeros-serie/ — Crea un nuevo registro y devuelve el objeto creado. */
  createNumeroSerie(dto: CreateNumeroSerieDto): Promise<NumeroSerie>
  /** PATCH /numeros-serie/:id/ — Actualiza parcialmente un registro. */
  updateNumeroSerie(id: number, dto: UpdateNumeroSerieDto): Promise<NumeroSerie>
  /** DELETE /numeros-serie/:id/ — Elimina el registro. */
  deleteNumeroSerie(id: number): Promise<void>
}