// src/domain/ports/turno-caja.repository.ts
import type { TurnoCaja } from '../entities/turno-caja.entity'
import type { CreateTurnoCajaDto, CloseTurnoCajaDto } from '@/application/dtos/turno-caja.dto'

export interface TurnoCajaRepository {
  /** GET /turnos-caja/ — Devuelve la lista paginada de turnos. */
  getTurnosCaja(): Promise<TurnoCaja[]>
  
  /** POST /turnos-caja/ — Abre un nuevo turno de caja. */
  abrirTurno(dto: CreateTurnoCajaDto): Promise<TurnoCaja>
  
  /** PATCH /turnos-caja/:id/ — Cierra un turno de caja existente. */
  cerrarTurno(id: number, dto: CloseTurnoCajaDto): Promise<TurnoCaja>
}
