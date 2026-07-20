// src/application/use-cases/alerta-stock-minimo.use-case.ts
import type { AlertaStockMinimoRepository } from '@/domain/ports/alerta-stock-minimo.repository'
import type { CreateAlertaStockMinimoDto } from '@/application/dtos/create-alerta-stock-minimo.dto'
import type { UpdateAlertaStockMinimoDto } from '@/application/dtos/update-alerta-stock-minimo.dto'

export class AlertaStockMinimoUseCase {
  private repository: AlertaStockMinimoRepository

  constructor(repository: AlertaStockMinimoRepository) {
    this.repository = repository
  }

  getAlertas() {
    return this.repository.getAlertas()
  }

  createAlerta(dto: CreateAlertaStockMinimoDto) {
    return this.repository.createAlerta(dto)
  }

  updateAlerta(id: number, dto: UpdateAlertaStockMinimoDto) {
    return this.repository.updateAlerta(id, dto)
  }

  deleteAlerta(id: number) {
    return this.repository.deleteAlerta(id)
  }
}