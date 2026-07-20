// src/application/use-cases/devolucion-cliente.use-case.ts
import type { DevolucionClienteRepository } from '@/domain/ports/devolucion-cliente.repository'
import type { CreateDevolucionClienteDto } from '@/application/dtos/create-devolucion-cliente.dto'
import type { UpdateDevolucionClienteDto } from '@/application/dtos/update-devolucion-cliente.dto'

export class DevolucionClienteUseCase {
  private repository: DevolucionClienteRepository

  constructor(repository: DevolucionClienteRepository) {
    this.repository = repository
  }

  getDevoluciones() {
    return this.repository.getDevoluciones()
  }

  createDevolucion(dto: CreateDevolucionClienteDto) {
    return this.repository.createDevolucion(dto)
  }

  updateDevolucion(id: number, dto: UpdateDevolucionClienteDto) {
    return this.repository.updateDevolucion(id, dto)
  }
}