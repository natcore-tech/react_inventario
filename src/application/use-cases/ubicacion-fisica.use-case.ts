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
}
