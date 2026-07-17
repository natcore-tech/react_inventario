// src/domain/ports/marca.repository.ts
import type { Marca } from '../entities/marca.entity'

/**
 * Contrato de acceso a datos para el recurso Marca.
 * Implementado por infrastructure/adapters/axios-marca.repository.ts
 */
export interface MarcaRepository {
  /** Devuelve la lista completa de marcas desde GET /marcas/. */
  getMarcas(): Promise<Marca[]>
}
