// src/infrastructure/adapters/axios-usuario-admin.repository.ts
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { UsuarioAdminRepository } from '@/domain/ports/usuario-admin.repository'
import type { UsuarioAdmin } from '@/domain/entities/usuario-admin.entity'

export class AxiosUsuarioAdminRepository implements UsuarioAdminRepository {
  /** GET /users/ */
  async getAll(): Promise<UsuarioAdmin[]> {
    try {
      const { data } = await apiClient.get<UsuarioAdmin[] | { results: UsuarioAdmin[] }>('/users/')
      // Soporta tanto lista plana como paginación DRF (results)
      return Array.isArray(data) ? data : data.results
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /users/:id/ — cambia is_staff */
  async setStaff(userId: number, isStaff: boolean): Promise<UsuarioAdmin> {
    try {
      const { data } = await apiClient.patch<UsuarioAdmin>(`/users/${userId}/`, {
        is_staff: isStaff,
      })
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }

  /** PATCH /users/:id/ — cambia is_active */
  async setActive(userId: number, isActive: boolean): Promise<UsuarioAdmin> {
    try {
      const { data } = await apiClient.patch<UsuarioAdmin>(`/users/${userId}/`, {
        is_active: isActive,
      })
      return data
    } catch (err) {
      throw parseApiError(err)
    }
  }
}
