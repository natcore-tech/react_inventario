// src/presentation/store/categoria.store.ts
import { create } from 'zustand'
import type { Categoria } from '@/domain/entities/categoria.entity'
import type { CreateCategoriaDto, UpdateCategoriaDto } from '@/application/dtos/categoria.dto'
import { categoriaUseCase } from '@/infrastructure/factories/categoria.factory'

interface CategoriaState {
  categorias: Categoria[]
  isLoading: boolean
  isSaving: boolean
  error: string | null

  // Acciones
  loadCategorias: () => Promise<void>
  createCategoria: (dto: CreateCategoriaDto) => Promise<void>
  updateCategoria: (id: number, dto: UpdateCategoriaDto) => Promise<void>
  deleteCategoria: (id: number) => Promise<void>
  clearError: () => void
}

export const useCategoriaStore = create<CategoriaState>((set, get) => ({
  categorias: [],
  isLoading: false,
  isSaving: false,
  error: null,

  loadCategorias: async () => {
    set({ isLoading: true, error: null })
    try {
      const categorias = await categoriaUseCase.getCategorias()
      set({ categorias, isLoading: false })
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'Error al cargar las categorías',
      })
    }
  },

  createCategoria: async (dto) => {
    set({ isSaving: true, error: null })
    try {
      const nueva = await categoriaUseCase.createCategoria(dto)
      const current = get().categorias
      set({
        categorias: [nueva, ...current],
        isSaving: false,
      })
    } catch (err: any) {
      set({ isSaving: false, error: err.message || 'Error al crear la categoría' })
      throw err
    }
  },

  updateCategoria: async (id, dto) => {
    set({ isSaving: true, error: null })
    try {
      const actualizada = await categoriaUseCase.updateCategoria(id, dto)
      const current = get().categorias
      set({
        categorias: current.map((c) => (c.id === id ? actualizada : c)),
        isSaving: false,
      })
    } catch (err: any) {
      set({ isSaving: false, error: err.message || 'Error al actualizar la categoría' })
      throw err
    }
  },

  deleteCategoria: async (id) => {
    set({ isSaving: true, error: null })
    try {
      await categoriaUseCase.deleteCategoria(id)
      const current = get().categorias
      // Eliminar del arreglo local para mantener sincronía con el backend
      set({
        categorias: current.filter((c) => c.id !== id),
        isSaving: false,
      })
    } catch (err: any) {
      set({ isSaving: false, error: err.message || 'Error al eliminar la categoría' })
      throw err
    }
  },

  clearError: () => set({ error: null }),
}))
