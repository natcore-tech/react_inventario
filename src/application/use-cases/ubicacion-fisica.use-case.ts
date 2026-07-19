// src/application/use-cases/ubicacion-fisica.use-case.ts
import type { UbicacionFisicaRepository } from '@/domain/ports/ubicacion-fisica.repository'
import type { UbicacionFisica } from '@/domain/entities/ubicacion-fisica.entity'

/**
 * Caso de uso para el módulo UbicacionFisica.
 * Orquesta la lógica de negocio delegando la persistencia al repositorio inyectado.
 */
export class UbicacionFisicaUseCase {
  private readonly repository: UbicacionFisicaRepository

  constructor(repository: UbicacionFisicaRepository) {
    this.repository = repository
  }

  /** Obtiene el listado completo de ubicaciones físicas. */
  getUbicaciones(): Promise<UbicacionFisica[]> {
    return this.repository.getUbicaciones()
  }

  /** Obtiene una ubicación física por su ID. */
  getUbicacionById(id: number): Promise<UbicacionFisica> {
    return this.repository.getUbicacionById(id)
  }

  /** Crea una nueva ubicación física. */
  createUbicacion(data: Omit<UbicacionFisica, 'id' | 'coordenada_exacta'>): Promise<UbicacionFisica> {
    return this.repository.createUbicacion(data)
  }

  /** Actualiza una ubicación física existente. */
  updateUbicacion(id: number, data: Partial<UbicacionFisica>): Promise<UbicacionFisica> {
    return this.repository.updateUbicacion(id, data)
  }

  /** Elimina una ubicación física por su ID. */
  deleteUbicacion(id: number): Promise<void> {
    return this.repository.deleteUbicacion(id)
  }
}
