import { create } from 'zustand';
import { cotizacionUseCase } from '../../infrastructure/factories/cotizacion.factory';
import type { Cotizacion } from '../../domain/entities/cotizacion.entity';
import type { CreateCotizacionDto } from '../../application/dtos/create-cotizacion.dto';
import type { UpdateCotizacionDto } from '../../application/dtos/update-cotizacion.dto';

interface CotizacionState {
  cotizaciones: Cotizacion[];
  cotizacionesTotal: number;
  isLoadingCotizaciones: boolean;
  cotizacionesError: string | null;
}

interface CotizacionActions {
  fetchCotizaciones(page?: number, search?: string): Promise<void>;
  createCotizacion(dto: CreateCotizacionDto): Promise<void>;
  updateCotizacion(id: number, dto: UpdateCotizacionDto): Promise<void>;
  deleteCotizacion(id: number): Promise<void>;
}

export const useCotizacionStore = create<CotizacionState & CotizacionActions>((set, get) => ({
  cotizaciones: [],
  cotizacionesTotal: 0,
  isLoadingCotizaciones: false,
  cotizacionesError: null,

  async fetchCotizaciones(page = 1, search = '') {
    set({ isLoadingCotizaciones: true, cotizacionesError: null });
    try {
      const data = await cotizacionUseCase.getCotizaciones(page, search);
      set({ cotizaciones: data.results, cotizacionesTotal: data.count });
    } catch {
      set({ cotizacionesError: 'No se pudieron cargar las cotizaciones.' });
    } finally {
      set({ isLoadingCotizaciones: false });
    }
  },

  async createCotizacion(dto) {
    try {
      const cotizacion = await cotizacionUseCase.createCotizacion(dto);
      set({
        cotizaciones: [cotizacion, ...get().cotizaciones],
        cotizacionesTotal: get().cotizacionesTotal + 1,
      });
    } catch (err) {
      throw err;
    }
  },

  async updateCotizacion(id, dto) {
    try {
      const updated = await cotizacionUseCase.updateCotizacion(id, dto);
      set({
        cotizaciones: get().cotizaciones.map((c) => (c.id === id ? updated : c)),
      });
    } catch (err) {
      throw err;
    }
  },

  async deleteCotizacion(id) {
    try {
      await cotizacionUseCase.deleteCotizacion(id);
      set({
        cotizaciones: get().cotizaciones.filter((c) => c.id !== id),
        cotizacionesTotal: get().cotizacionesTotal - 1,
      });
    } catch (err) {
      throw err;
    }
  },
}));