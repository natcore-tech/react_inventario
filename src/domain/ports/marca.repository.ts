// src/domain/ports/marca.repository.ts
import type { Marca } from '../entities/marca.entity'

/**
 * Contrato de acceso a datos para el recurso Marca.
 * Implementado por infrastructure/adapters/axios-marca.repository.ts
 */
export interface MarcaRepository {
  /** Devuelve la lista completa de marcas desde GET /marcas/. */
  getMarcas(): Promise<Marca[]>

  /** Obtiene una marca por su ID. */
  getMarcaById(id: number): Promise<Marca>

  /** Crea una nueva marca. */
  createMarca(data: Omit<Marca, 'id'>): Promise<Marca>

  /** Actualiza una marca existente. */
  updateMarca(id: number, data: Partial<Marca>): Promise<Marca>

  /** Elimina una marca por su ID. */
  deleteMarca(id: number): Promise<void>
}
