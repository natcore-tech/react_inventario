// src/domain/entities/logged-user.entity.ts

/** Usuario autenticado tal como lo devuelve el endpoint /auth/me/ */
export interface LoggedUser {
  user_id: number
  username: string
  email: string
  is_staff: boolean
  first_name?: string
  last_name?: string
  avatar_url?: string | null
}