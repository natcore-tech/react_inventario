import { apiClient } from '@/infrastructure/http/axios-client';
import { Cotizacion } from '../../domain/entities/cotizacion.entity';
import { CotizacionRepository } from '../../domain/ports/cotizacion.repository';

type CreateCotizacionPayload = Parameters<CotizacionRepository['createCotizacion']>[0];

export class AxiosCotizacionRepository implements CotizacionRepository {
  async getCotizaciones(page = 1, search = ''): Promise<{ count: number; results: Cotizacion[] }> {
    try {
      const { data } = await apiClient.get<{ count: number; results: Cotizacion[] }>('/cotizaciones/', {
        params: { page, search }
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getCotizacion(id: number): Promise<Cotizacion> {
    try {
      const { data } = await apiClient.get<Cotizacion>(`/cotizaciones/${id}/`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async createCotizacion(payload: CreateCotizacionPayload): Promise<Cotizacion> {
    try {
      const { data } = await apiClient.post<Cotizacion>('/cotizaciones/', payload);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateCotizacion(id: number, payload: Partial<CreateCotizacionPayload>): Promise<Cotizacion> {
    try {
      const { data } = await apiClient.patch<Cotizacion>(`/cotizaciones/${id}/`, payload);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async deleteCotizacion(id: number): Promise<void> {
    try {
      await apiClient.delete(`/cotizaciones/${id}/`);
    } catch (error) {
      throw error;
    }
  }
}