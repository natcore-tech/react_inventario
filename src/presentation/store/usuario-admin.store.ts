// src/presentation/store/usuario-admin.store.ts
import { create } from 'zustand'
import { usuarioAdminUseCase } from '@/infrastructure/factories/usuario-admin.factory'
import type { UsuarioAdmin } from '@/domain/entities/usuario-admin.entity'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UsuarioAdminState {
  usuarios: UsuarioAdmin[]
  isLoading: boolean
  /** ID del usuario cuya operación de guardado está en curso */
  savingId: number | null
  error: string | null
}

interface UsuarioAdminActions {
  /** GET /users/ — carga la lista completa */
  loadUsuarios(): Promise<void>
  /**
   * Asciende o degrada el rol is_staff de un usuario.
   * Actualiza el estado local optimísticamente y revierte si falla.
   */
  toggleStaff(userId: number, current: boolean): Promise<void>
  /**
   * Activa o desactiva la cuenta de un usuario.
   */
  toggleActive(userId: number, current: boolean): Promise<void>
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUsuarioAdminStore = create<UsuarioAdminState & UsuarioAdminActions>(
  (set) => ({
    usuarios: [],
    isLoading: false,
    savingId: null,
    error: null,

    async loadUsuarios() {
      set({ isLoading: true, error: null })
      try {
        const usuarios = await usuarioAdminUseCase.getAll()
        set({ usuarios, isLoading: false })
      } catch (err: unknown) {
        const e = err as { detail?: string; message?: string }
        set({
          isLoading: false,
          error: e.detail ?? e.message ?? 'Error al cargar usuarios',
        })
      }
    },

    async toggleStaff(userId, current) {
      // Optimistic update
      set((s) => ({
        savingId: userId,
        usuarios: s.usuarios.map((u) =>
          u.id === userId ? { ...u, is_staff: !current } : u,
        ),
      }))
      try {
        const updated = await usuarioAdminUseCase.setStaff(userId, !current)
        // Confirmar con la respuesta del servidor
        set((s) => ({
          savingId: null,
          usuarios: s.usuarios.map((u) => (u.id === userId ? updated : u)),
        }))
      } catch (err: unknown) {
        // Revertir al estado anterior
        const e = err as { detail?: string; message?: string }
        set((s) => ({
          savingId: null,
          error: e.detail ?? e.message ?? 'Error al cambiar el rol',
          usuarios: s.usuarios.map((u) =>
            u.id === userId ? { ...u, is_staff: current } : u,
          ),
        }))
      }
    },

    async toggleActive(userId, current) {
      set((s) => ({
        savingId: userId,
        usuarios: s.usuarios.map((u) =>
          u.id === userId ? { ...u, is_active: !current } : u,
        ),
      }))
      try {
        const updated = await usuarioAdminUseCase.setActive(userId, !current)
        set((s) => ({
          savingId: null,
          usuarios: s.usuarios.map((u) => (u.id === userId ? updated : u)),
        }))
      } catch (err: unknown) {
        const e = err as { detail?: string; message?: string }
        set((s) => ({
          savingId: null,
          error: e.detail ?? e.message ?? 'Error al cambiar el estado',
          usuarios: s.usuarios.map((u) =>
            u.id === userId ? { ...u, is_active: current } : u,
          ),
        }))
      }
    },

    clearError() {
      set({ error: null })
    },
  }),
)

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectAdmins = (s: UsuarioAdminState) =>
  s.usuarios.filter((u) => u.is_staff)

export const selectOperativos = (s: UsuarioAdminState) =>
  s.usuarios.filter((u) => !u.is_staff)
