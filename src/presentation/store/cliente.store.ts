// src/presentation/store/cliente.store.ts
import { create } from 'zustand'
import { clienteUseCase } from '@/infrastructure/factories/cliente.factory'
import type { Cliente } from '@/domain/entities/cliente.entity'
import type { CreateClienteDto, UpdateClienteDto } from '@/application/dtos/cliente.dto'

// ─── Tipos del store ──────────────────────────────────────────────────────────

interface ClienteState {
  /** Lista de clientes cargados desde la API. */
  clientes: Cliente[]
  /** true mientras GET /clientes/ está en curso. */
  isLoading: boolean
  /** true mientras POST, PATCH o DELETE están en curso. */
  isSaving: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface ClienteActions {
  /** GET /clientes/ — carga la lista y la guarda en el estado. */
  loadClientes(): Promise<void>
  /** POST /clientes/ — crea un cliente y recarga la lista. */
  createCliente(dto: CreateClienteDto): Promise<void>
  /** PATCH /clientes/:id/ — actualiza un cliente y recarga la lista. */
  updateCliente(id: number, dto: UpdateClienteDto): Promise<void>
  /** DELETE /clientes/:id/ — elimina (soft delete) y recarga la lista. */
  deleteCliente(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useClienteStore = create<ClienteState & ClienteActions>((set, get) => ({
  // ── Estado inicial ──────────────────────────────────────────────────────
  clientes: [],
  isLoading: false,
  isSaving: false,
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

  async createCliente(dto) {
    set({ isSaving: true, error: null })
    try {
      await clienteUseCase.createCliente(dto)
      set({ isSaving: false })
      await get().loadClientes()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al crear el cliente',
      })
      throw err
    }
  },

  async updateCliente(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await clienteUseCase.updateCliente(id, dto)
      set({ isSaving: false })
      await get().loadClientes()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar el cliente',
      })
      throw err
    }
  },

  async deleteCliente(id) {
    set({ isSaving: true, error: null })
    try {
      await clienteUseCase.deleteCliente(id)
      set({ isSaving: false })
      await get().loadClientes()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar el cliente',
      })
      throw err
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
