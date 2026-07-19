// src/domain/ports/ubicacion-fisica.repository.ts
import type { UbicacionFisica } from '../entities/ubicacion-fisica.entity'

/**
 * Contrato de acceso a datos para el recurso UbicacionFisica.
 * Implementado por infrastructure/adapters/axios-ubicacion-fisica.repository.ts
 */
export interface UbicacionFisicaRepository {
  /** Devuelve la lista completa de ubicaciones físicas desde GET /ubicaciones/. */
  getUbicaciones(): Promise<UbicacionFisica[]>

  /** Obtiene una ubicación física por su ID. */
  getUbicacionById(id: number): Promise<UbicacionFisica>

  /** Crea una nueva ubicación física. */
  createUbicacion(data: Omit<UbicacionFisica, 'id' | 'coordenada_exacta'>): Promise<UbicacionFisica>

  /** Actualiza una ubicación física existente. */
  updateUbicacion(id: number, data: Partial<UbicacionFisica>): Promise<UbicacionFisica>

  /** Elimina una ubicación física por su ID. */
  deleteUbicacion(id: number): Promise<void>
}
