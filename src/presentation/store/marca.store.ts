// src/presentation/store/marca.store.ts
import { create } from 'zustand'
import { MarcaUseCase } from '@/application/use-cases/marca.use-case'
import { AxiosMarcaRepository } from '@/infrastructure/adapters/axios-marca.repository'
import type { Marca } from '@/domain/entities/marca.entity'

interface MarcaState {
  marcas: Marca[]
  loading: boolean
  error: string | null
  fetchMarcas: () => Promise<void>
}

const useCase = new MarcaUseCase(new AxiosMarcaRepository())

export const useMarcaStore = create<MarcaState>((set) => ({
  marcas: [],
  loading: false,
  error: null,

  fetchMarcas: async () => {
    set({ loading: true, error: null })
    try {
      const marcas = await useCase.getMarcas()
      set({ marcas, loading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar marcas'
      set({ error: message, loading: false })
    }
  },
}))
