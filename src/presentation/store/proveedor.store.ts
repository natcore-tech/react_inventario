// src/presentation/store/proveedor.store.ts
import { create } from 'zustand'
import { apiClient } from '@/infrastructure/http/axios-client'
import { parseApiError } from '@/infrastructure/http/parse-api-error'
import type { Proveedor } from '@/domain/entities/proveedor.entity'

interface PaginatedProveedores {
  results: Proveedor[]
}

interface ProveedorState {
  proveedores: Proveedor[]
  isLoading: boolean
  error: string | null
}

interface ProveedorActions {
  loadProveedores(): Promise<void>
}

/**
 * Mini-store para cargar proveedores (solo GET).
 * Útil para popular selects hasta que se implemente el CRUD completo.
 */
export const useProveedorStore = create<ProveedorState & ProveedorActions>((set) => ({
  proveedores: [],
  isLoading: false,
  error: null,

  async loadProveedores() {
    set({ isLoading: true, error: null })
    try {
      // Ajusta la ruta a la real de tu API si es distinta
      const { data } = await apiClient.get<PaginatedProveedores>('/proveedores/')
      set({ proveedores: data.results, isLoading: false })
    } catch (err) {
      const apiErr = parseApiError(err)
      set({ isLoading: false, error: apiErr.message ?? 'Error al cargar proveedores' })
    }
  },
}))
