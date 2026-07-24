
// src/presentation/store/auth.store.ts
import { create } from 'zustand'
import { authUseCase } from '@/infrastructure/factories/auth.factory'
import { AUTH_EXPIRED_EVENT } from '@/infrastructure/http/axios-client'
import type { LoggedUser } from '@/domain/entities/logged-user.entity'
import type { AuthTokens } from '@/domain/entities/auth-tokens.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface AuthState {
  /** Usuario autenticado, o null si no hay sesión activa. */
  user: LoggedUser | null
  /** Tokens JWT actuales, o null si no hay sesión. */
  tokens: AuthTokens | null
  /** true mientras hay una operación de red en curso (login, register, logout). */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface AuthActions {
  /** Inicia sesión con username y password. */
  login(username: string, password: string): Promise<void>
  /** Registra un nuevo usuario y lo autentica automáticamente. */
  register(username: string, email: string, password: string): Promise<void>
  /** Cierra la sesión: invalida el token en el servidor y limpia el estado. */
  logout(): Promise<void>
  /**
   * Restaura la sesión a partir de los tokens guardados.
   * Debe llamarse al montar la app (useEffect en AppRouter).
   */
  loadSession(): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
  /** Limpia el estado de sesión sin llamar al servidor (usado por authExpired). */
  _clearSession(): void
  /** Actualiza el perfil del usuario (nombre, avatar) y actualiza el estado local */
  updateProfile(data: FormData): Promise<void>
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>((set, get) => {
  // Suscribirse al evento authExpired que dispara el interceptor de Axios
  // cuando el refresh token ya no es válido.
  // Lo registramos aquí para que esté activo desde el inicio de la app.
  if (typeof window !== 'undefined') {
    window.addEventListener(AUTH_EXPIRED_EVENT, () => {
      get()._clearSession()
    })
  }

  return {
    // ── Estado inicial ──────────────────────────────────────────────────────
    user: null,
    tokens: null,
    isLoading: true, // Inicializa en true para evitar parpadeos (flash of unauthenticated content) al cargar la app
    error: null,

    // ── Acciones ────────────────────────────────────────────────────────────

    async login(username, password) {
      set({ isLoading: true, error: null })
      try {
        const { user, tokens } = await authUseCase.login({ username, password })
        set({ user, tokens, isLoading: false })
      } catch (err: unknown) {
        const apiErr = err as { detail?: string; message?: string }
        set({
          isLoading: false,
          error: apiErr.detail ?? apiErr.message ?? 'Error al iniciar sesión',
        })
        throw err
      }
    },

    async register(username, email, password) {
      set({ isLoading: true, error: null })
      try {
        const { user, tokens } = await authUseCase.register({ username, email, password })
        set({ user, tokens, isLoading: false })
      } catch (err: unknown) {
        const apiErr = err as { detail?: string; message?: string }
        set({
          isLoading: false,
          error: apiErr.detail ?? apiErr.message ?? 'Error al registrarse',
        })
        throw err
      }
    },

    async logout() {
      set({ isLoading: true })
      await authUseCase.logout()
      set({ user: null, tokens: null, isLoading: false, error: null })
    },

    async loadSession() {
      set({ isLoading: true })
      const session = await authUseCase.restoreSession()
      if (session) {
        set({ user: session.user, tokens: session.tokens, isLoading: false })
      } else {
        set({ user: null, tokens: null, isLoading: false })
      }
    },

    clearError() {
      set({ error: null })
    },

    _clearSession() {
      authUseCase.clearLocalSession()
      const state = get()
      if (state.user !== null || state.tokens !== null) {
        set({ user: null, tokens: null, isLoading: false, error: null })
      }
    },

    async updateProfile(data: FormData) {
      set({ isLoading: true, error: null })
      try {
        const updatedUser = await authUseCase.updateProfile(data)
        set((state) => ({ 
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser, 
          isLoading: false 
        }))
      } catch (err: unknown) {
        const apiErr = err as { detail?: string; message?: string }
        set({
          isLoading: false,
          error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar perfil',
        })
        throw err
      }
    },
  }
})

// ─── Selectores de conveniencia ───────────────────────────────────────────────

/** true si hay un usuario autenticado. */
export const selectIsAuthenticated = (state: AuthState) => state.user !== null

/** true si el usuario autenticado tiene rol de staff/admin. */
export const selectIsStaff = (state: AuthState) =>
  state.user?.is_staff === true