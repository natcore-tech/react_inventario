// src/domain/ports/usuario-admin.repository.ts
import type { UsuarioAdmin } from '@/domain/entities/usuario-admin.entity'

/** Puerto para gestión de usuarios (solo accesible para administradores) */
export interface UsuarioAdminRepository {
  /** GET /users/ — lista todos los usuarios del sistema */
  getAll(): Promise<UsuarioAdmin[]>
  /** PATCH /users/:id/ — actualiza el campo is_staff de un usuario */
  setStaff(userId: number, isStaff: boolean): Promise<UsuarioAdmin>
  /** PATCH /users/:id/ — activa o desactiva un usuario */
  setActive(userId: number, isActive: boolean): Promise<UsuarioAdmin>
}
