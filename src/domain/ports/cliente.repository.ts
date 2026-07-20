// src/domain/ports/cliente.repository.ts
import type { Cliente } from '../entities/cliente.entity'
import type { CreateClienteDto, UpdateClienteDto } from '@/application/dtos/cliente.dto'

/**
 * Contrato de acceso a datos de Cliente.
 * Implementado por infrastructure/adapters/axios-cliente.repository.ts
 */
export interface ClienteRepository {
  /** GET /clientes/ — Devuelve la lista paginada de clientes. */
  getClientes(): Promise<Cliente[]>
  /** POST /clientes/ — Crea un nuevo cliente y devuelve el objeto creado. */
  createCliente(dto: CreateClienteDto): Promise<Cliente>
  /** PATCH /clientes/:id/ — Actualiza parcialmente un cliente. */
  updateCliente(id: number, dto: UpdateClienteDto): Promise<Cliente>
  /** DELETE /clientes/:id/ — Elimina (soft delete) un cliente. */
  deleteCliente(id: number): Promise<void>
}
