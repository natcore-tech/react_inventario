// src/application/use-cases/usuario-admin.use-case.ts
import type { UsuarioAdminRepository } from '@/domain/ports/usuario-admin.repository'
import type { UsuarioAdmin } from '@/domain/entities/usuario-admin.entity'

export class UsuarioAdminUseCase {
  constructor(private readonly repo: UsuarioAdminRepository) {}

  getAll(): Promise<UsuarioAdmin[]> {
    return this.repo.getAll()
  }

  setStaff(userId: number, isStaff: boolean): Promise<UsuarioAdmin> {
    return this.repo.setStaff(userId, isStaff)
  }

  setActive(userId: number, isActive: boolean): Promise<UsuarioAdmin> {
    return this.repo.setActive(userId, isActive)
  }
}
