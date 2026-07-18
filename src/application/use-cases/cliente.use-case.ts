// src/application/use-cases/cliente.use-case.ts
import type { ClienteRepository } from '@/domain/ports/cliente.repository'
import type { Cliente } from '@/domain/entities/cliente.entity'
import type { CreateClienteDto, UpdateClienteDto } from '@/application/dtos/cliente.dto'

export class ClienteUseCase {
  private readonly clienteRepository: ClienteRepository

  constructor(clienteRepository: ClienteRepository) {
    this.clienteRepository = clienteRepository
  }

  /** Devuelve todos los clientes del listado paginado. */
  getClientes(): Promise<Cliente[]> {
    return this.clienteRepository.getClientes()
  }

  /** Crea un nuevo cliente. */
  createCliente(dto: CreateClienteDto): Promise<Cliente> {
    return this.clienteRepository.createCliente(dto)
  }

  /** Actualiza parcialmente un cliente existente (PATCH). */
  updateCliente(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    return this.clienteRepository.updateCliente(id, dto)
  }

  /** Elimina (soft delete) un cliente por su id. */
  deleteCliente(id: number): Promise<void> {
    return this.clienteRepository.deleteCliente(id)
  }
}
