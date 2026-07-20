// src/infrastructure/factories/traslado-bodega-detalle.factory.ts
import { AxiosTrasladoBodegaDetalleRepository } from '@/infrastructure/adapters/axios-traslado-bodega-detalle.repository'
import { TrasladoBodegaDetalleUseCase } from '@/application/use-cases/traslado-bodega-detalle.use-case'

/**
 * Instancia única del caso de uso de TrasladoBodegaDetalle, ya conectada a su
 * implementación concreta (AxiosTrasladoBodegaDetalleRepository).
 * El resto de la app importa `trasladoBodegaDetalleUseCase` y nunca instancia
 * TrasladoBodegaDetalleUseCase ni AxiosTrasladoBodegaDetalleRepository directamente.
 */
export const trasladoBodegaDetalleUseCase = new TrasladoBodegaDetalleUseCase(
  new AxiosTrasladoBodegaDetalleRepository()
)
