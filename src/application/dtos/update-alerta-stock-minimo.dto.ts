// src/application/dtos/update-alerta-stock-minimo.dto.ts
export interface UpdateAlertaStockMinimoDto {
  producto?: number
  cantidad_minima?: number
  email_notificacion?: string
  activa?: boolean
}