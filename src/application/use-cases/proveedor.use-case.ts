// Ruta: src/application/use-cases/proveedor.use-case.ts

import type { ProveedorRepository } from '../../domain/ports/proveedor.repository'
import type { Proveedor } from '../../domain/entities/proveedor.entity'
import type { CreateProveedorDto } from '../dtos/create-proveedor.dto'
import type { UpdateProveedorDto } from '../dtos/update-proveedor.dto'

export class ProveedorUseCase {
  constructor(private readonly proveedorRepository: ProveedorRepository) {}

  getProveedores(): Promise<Proveedor[]> {
    return this.proveedorRepository.getProveedores()
  }

  getProveedor(id: number): Promise<Proveedor> {
    return this.proveedorRepository.getProveedor(id)
  }

  createProveedor(dto: CreateProveedorDto): Promise<Proveedor> {
    return this.proveedorRepository.createProveedor(dto)
  }

  updateProveedor(id: number, dto: UpdateProveedorDto): Promise<Proveedor> {
    return this.proveedorRepository.updateProveedor(id, dto)
  }

  deleteProveedor(id: number): Promise<void> {
    return this.proveedorRepository.deleteProveedor(id)
  }
}