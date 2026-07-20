// src/application/use-cases/numero-serie.use-case.ts
import type { NumeroSerieRepository } from '@/domain/ports/numero-serie.repository'
import type { CreateNumeroSerieDto } from '@/application/dtos/create-numero-serie.dto'
import type { UpdateNumeroSerieDto } from '@/application/dtos/update-numero-serie.dto'

export class NumeroSerieUseCase {
  private repository: NumeroSerieRepository

  constructor(repository: NumeroSerieRepository) {
    this.repository = repository
  }

  getNumerosSerie() {
    return this.repository.getNumerosSerie()
  }

  createNumeroSerie(dto: CreateNumeroSerieDto) {
    return this.repository.createNumeroSerie(dto)
  }

  updateNumeroSerie(id: number, dto: UpdateNumeroSerieDto) {
    return this.repository.updateNumeroSerie(id, dto)
  }

  deleteNumeroSerie(id: number) {
    return this.repository.deleteNumeroSerie(id)
  }
}