// src/application/use-cases/turno-caja.use-case.ts
import type { TurnoCajaRepository } from '@/domain/ports/turno-caja.repository'
import type { TurnoCaja } from '@/domain/entities/turno-caja.entity'
import type { CreateTurnoCajaDto, CloseTurnoCajaDto } from '@/application/dtos/turno-caja.dto'

export class TurnoCajaUseCase {
  private readonly repository: TurnoCajaRepository;

  constructor(repository: TurnoCajaRepository) {
    this.repository = repository;
  }

  getTurnosCaja(): Promise<TurnoCaja[]> {
    return this.repository.getTurnosCaja()
  }

  abrirTurno(dto: CreateTurnoCajaDto): Promise<TurnoCaja> {
    return this.repository.abrirTurno(dto)
  }

  cerrarTurno(id: number, dto: CloseTurnoCajaDto): Promise<TurnoCaja> {
    return this.repository.cerrarTurno(id, dto)
  }
}
