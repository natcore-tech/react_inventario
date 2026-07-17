// src/infrastructure/adapters/axios-traslado-bodega-detalle.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { TrasladoBodegaDetalleRepository } from '@/domain/ports/traslado-bodega-detalle.repository'
import type { TrasladoBodegaDetalle } from '@/domain/entities/traslado-bodega-detalle.entity'

/**
 * Forma parcial de la respuesta de GET /traslados-bodegas/{id}/
 * Solo se extrae el campo 'detalles' que es lo que nos interesa.
 */
interface TrasladoConDetalles {
  detalles: TrasladoBodegaDetalle[]
}

/**
 * Implementación concreta del puerto TrasladoBodegaDetalleRepository usando Axios.
 *
 * NOTA: TrasladoBodegaDetalle NO tiene endpoint propio en el router de Django.
 * Los detalles se obtienen como campo anidado desde GET /traslados-bodegas/{id}/.
 */
export class AxiosTrasladoBodegaDetalleRepository implements TrasladoBodegaDetalleRepository {
  /**
   * GET /traslados-bodegas/{trasladoId}/ — extrae únicamente el campo 'detalles'
   * de la respuesta del traslado padre.
   */
  async getDetallesPorTraslado(trasladoId: number): Promise<TrasladoBodegaDetalle[]> {
    try {
      const { data } = await apiClient.get<TrasladoConDetalles>(`/traslados-bodegas/${trasladoId}/`)
      return data.detalles
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
