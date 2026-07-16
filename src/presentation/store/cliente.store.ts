// src/presentation/store/cliente.store.ts
import { create } from 'zustand'
import { clienteUseCase } from '@/infrastructure/factories/cliente.factory'
import type { Cliente } from '@/domain/entities/cliente.entity'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface ClienteState {
  /** Lista de clientes cargados desde la API. */
  clientes: Cliente[]
  /** true mientras la petición de red está en curso. */
  isLoading: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface ClienteActions {
  /** GET /clientes/ — carga la lista y la guarda en el estado. */
  loadClientes(): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useClienteStore = create<ClienteState & ClienteActions>((set) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  clientes: [],
  isLoading: false,
  error: null,

  // ── Acciones ────────────────────────────────────────────────────────────

  async loadClientes() {
    set({ isLoading: true, error: null })
    try {
      const clientes = await clienteUseCase.getClientes()
      set({ clientes, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los clientes',
      })
    }
  },

  clearError() {
    set({ error: null })
  },
}))

// ─── Selectores de conveniencia ───────────────────────────────────────────────

/** Clientes activos solamente. */
export const selectClientesActivos = (state: ClienteState) =>
  state.clientes.filter((c) => c.es_activo)

/** Clientes inactivos solamente. */
export const selectClientesInactivos = (state: ClienteState) =>
  state.clientes.filter((c) => !c.es_activo)

/** Clientes con al menos una compra registrada. */
export const selectClientesConCompras = (state: ClienteState) =>
  state.clientes.filter((c) => c.total_compras > 0)
