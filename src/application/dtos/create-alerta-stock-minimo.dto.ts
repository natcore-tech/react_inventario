// src/application/dtos/create-alerta-stock-minimo.dto.ts
export interface CreateAlertaStockMinimoDto {
  producto: number
  cantidad_minima: number
  email_notificacion: string
  /** Opcional: el backend usa `true` como default si se omite. */
  activa?: boolean
}