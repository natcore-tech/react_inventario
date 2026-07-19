// src/domain/ports/alerta-stock-minimo.repository.ts
import type { AlertaStockMinimo } from '../entities/alerta-stock-minimo.entity'
import type { CreateAlertaStockMinimoDto } from '@/application/dtos/create-alerta-stock-minimo.dto'
import type { UpdateAlertaStockMinimoDto } from '@/application/dtos/update-alerta-stock-minimo.dto'

export interface AlertaStockMinimoRepository {
  getAlertas(): Promise<AlertaStockMinimo[]>
  createAlerta(dto: CreateAlertaStockMinimoDto): Promise<AlertaStockMinimo>
  updateAlerta(id: number, dto: UpdateAlertaStockMinimoDto): Promise<AlertaStockMinimo>
  deleteAlerta(id: number): Promise<void>
}