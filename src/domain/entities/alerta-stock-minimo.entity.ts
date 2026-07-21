// src/domain/entities/alerta-stock-minimo.entity.ts

/**
 * Alerta de stock mínimo tal como la devuelve AlertaStockMinimoSerializer.
 *
 * Nota: `producto` viene como ID plano (number), NO anidado — mismo patrón
 * que NumeroSerie/AjusteInventario (fields = '__all__').
 * `producto` es único (OneToOneField en el backend): un producto solo puede
 * tener UNA alerta configurada.
 */
export interface AlertaStockMinimo {
  id: number
  producto: number
  cantidad_minima: number
  email_notificacion: string
  activa: boolean
}