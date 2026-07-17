// src/domain/ports/ubicacion-fisica.repository.ts
import type { UbicacionFisica } from '../entities/ubicacion-fisica.entity'

/**
 * Contrato de acceso a datos para el recurso UbicacionFisica.
 * Implementado por infrastructure/adapters/axios-ubicacion-fisica.repository.ts
 */
export interface UbicacionFisicaRepository {
  /** Devuelve la lista completa de ubicaciones físicas desde GET /ubicaciones/. */
  getUbicaciones(): Promise<UbicacionFisica[]>
}
