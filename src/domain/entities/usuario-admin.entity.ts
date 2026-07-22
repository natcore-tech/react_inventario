// src/domain/entities/usuario-admin.entity.ts

/** Representación de un usuario del sistema vista desde la gestión de admin */
export interface UsuarioAdmin {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_superuser: boolean
  is_active: boolean
  date_joined: string
  last_login: string | null
}
