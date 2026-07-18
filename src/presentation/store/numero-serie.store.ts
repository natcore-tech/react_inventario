// src/presentation/store/numero-serie.store.ts
import { create } from 'zustand'
import { numeroSerieUseCase } from '@/infrastructure/factories/numero-serie.factory'
import type { NumeroSerie } from '@/domain/entities/numero-serie.entity'
import type { CreateNumeroSerieDto } from '@/application/dtos/create-numero-serie.dto'
import type { UpdateNumeroSerieDto } from '@/application/dtos/update-numero-serie.dto'

interface NumeroSerieState {
  /** Lista de números de serie cargados desde la API. */
  numerosSerie: NumeroSerie[]
  /** true mientras GET /numeros-serie/ está en curso. */
  isLoading: boolean
  /** true mientras POST, PATCH o DELETE están en curso. */
  isSaving: boolean
  /** Mensaje de error del último intento fallido, null si no hay error. */
  error: string | null
}

interface NumeroSerieActions {
  /** GET /numeros-serie/ — carga la lista y la guarda en el estado. */
  loadNumerosSerie(): Promise<void>
  /** POST /numeros-serie/ — crea un registro y recarga la lista. */
  createNumeroSerie(dto: CreateNumeroSerieDto): Promise<void>
  /** PATCH /numeros-serie/:id/ — actualiza un registro y recarga la lista. */
  updateNumeroSerie(id: number, dto: UpdateNumeroSerieDto): Promise<void>
  /** DELETE /numeros-serie/:id/ — elimina y recarga la lista. */
  deleteNumeroSerie(id: number): Promise<void>
  /** Limpia el error actual. */
  clearError(): void
}

export const useNumeroSerieStore = create<NumeroSerieState & NumeroSerieActions>((set, get) => ({
  numerosSerie: [],
  isLoading: false,
  isSaving: false,
  error: null,

  async loadNumerosSerie() {
    set({ isLoading: true, error: null })
    try {
      const numerosSerie = await numeroSerieUseCase.getNumerosSerie()
      set({ numerosSerie, isLoading: false })
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isLoading: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al cargar los números de serie',
      })
    }
  },

  async createNumeroSerie(dto) {
    set({ isSaving: true, error: null })
    try {
      await numeroSerieUseCase.createNumeroSerie(dto)
      set({ isSaving: false })
      await get().loadNumerosSerie()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al registrar el número de serie',
      })
      throw err
    }
  },

  async updateNumeroSerie(id, dto) {
    set({ isSaving: true, error: null })
    try {
      await numeroSerieUseCase.updateNumeroSerie(id, dto)
      set({ isSaving: false })
      await get().loadNumerosSerie()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al actualizar el número de serie',
      })
      throw err
    }
  },

  async deleteNumeroSerie(id) {
    set({ isSaving: true, error: null })
    try {
      await numeroSerieUseCase.deleteNumeroSerie(id)
      set({ isSaving: false })
      await get().loadNumerosSerie()
    } catch (err: unknown) {
      const apiErr = err as { detail?: string; message?: string }
      set({
        isSaving: false,
        error: apiErr.detail ?? apiErr.message ?? 'Error al eliminar el número de serie',
      })
      throw err
    }
  },

  clearError() {
    set({ error: null })
  },
}))