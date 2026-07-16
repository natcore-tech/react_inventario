// src/domain/ports/cliente.repository.ts
import type { Cliente } from '../entities/cliente.entity'

/**
 * Contrato de acceso a datos de Cliente.
 * Implementado por infrastructure/adapters/axios-cliente.repository.ts
 */
export interface ClienteRepository {
  /** GET /clientes/ — Devuelve la lista paginada de clientes. */
  getClientes(): Promise<Cliente[]>
}
