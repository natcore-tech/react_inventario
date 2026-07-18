// src/presentation/store/turno-caja.store.ts
import { create } from 'zustand'
import { turnoCajaUseCase } from '@/infrastructure/factories/turno-caja.factory'
import type { TurnoCaja } from '@/domain/entities/turno-caja.entity'
import type { CreateTurnoCajaDto, CloseTurnoCajaDto } from '@/application/dtos/turno-caja.dto'
import { useAuthStore } from './auth.store'

interface TurnoCajaState {
  turnos: TurnoCaja[]
  isLoading: boolean
  isSaving: boolean
  error: string | null
}

interface TurnoCajaActions {
  loadTurnos(): Promise<void>
  abrirTurno(dto: CreateTurnoCajaDto): Promise<void>
  cerrarTurno(id: number, dto: CloseTurnoCajaDto): Promise<void>
  clearError(): void
}

export const useTurnoCajaStore = create<TurnoCajaState & TurnoCajaActions>((set, get) => ({
  turnos: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadTurnos() {
    set({ isLoading: true, error: null })
    try {
      const turnos = await turnoCajaUseCase.getTurnosCaja()
      set({ turnos, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los turnos de caja',
      })
    }
  },

  async abrirTurno(dto) {
    set({ isSaving: true, error: null })
    try {
      await turnoCajaUseCase.abrirTurno(dto)
      set({ isSaving: false })
      await get().loadTurnos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string; non_field_errors?: string[] }
      let errorMsg = 'Error al abrir el turno'
      if (apiErr.non_field_errors?.length) {
        errorMsg = apiErr.non_field_errors[0]
      } else if (apiErr.detail || apiErr.message) {
        errorMsg = apiErr.detail ?? apiErr.message ?? errorMsg
      }
      set({ isSaving: false, error: errorMsg })
      throw err
    }
  },

  async cerrarTurno(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await turnoCajaUseCase.cerrarTurno(id, dto)
      set({ isSaving: false })
      await get().loadTurnos()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string; monto_cierre?: string[] }
      let errorMsg = 'Error al cerrar el turno'
      if (apiErr.monto_cierre?.length) {
        errorMsg = apiErr.monto_cierre[0]
      } else if (apiErr.detail || apiErr.message) {
        errorMsg = apiErr.detail ?? apiErr.message ?? errorMsg
      }
      set({ isSaving: false, error: errorMsg })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))

// ─── Selectores derivados ───────────────────────────────────────────────────

/**
 * Retorna el turno de caja que está 'ABIERTO' y pertenece al usuario actual logueado.
 * Si no hay ninguno, retorna undefined.
 */
export const useTurnoAbiertoActual = () => {
  const turnos = useTurnoCajaStore((state) => state.turnos)
  const user = useAuthStore((state) => state.user)

  if (!user) return undefined

  return turnos.find((t) => t.estado === 'ABIERTO' && t.cajero === user.user_id)
}
