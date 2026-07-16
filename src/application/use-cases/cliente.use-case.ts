// src/application/use-cases/cliente.use-case.ts
import type { ClienteRepository } from '@/domain/ports/cliente.repository'
import type { Cliente } from '@/domain/entities/cliente.entity'

export class ClienteUseCase {
  private readonly clienteRepository: ClienteRepository

  constructor(clienteRepository: ClienteRepository) {
    this.clienteRepository = clienteRepository
  }

  /** Devuelve todos los clientes del listado paginado. */
  getClientes(): Promise<Cliente[]> {
    return this.clienteRepository.getClientes()
  }
}
