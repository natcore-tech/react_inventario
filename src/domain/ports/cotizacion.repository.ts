import { Cotizacion } from '../entities/cotizacion.entity';

export interface CotizacionRepository {
  getCotizaciones(page?: number, search?: string): Promise<{ count: number; results: Cotizacion[] }>;
  getCotizacion(id: number): Promise<Cotizacion>;
  createCotizacion(payload: {
    proveedor: number;
    codigo_cotizacion: string;
    fecha_validez: string;
    total_propuesto: number;
    detalles: Array<{
      producto: number;
      cantidad: number;
      precio_propuesto: number;
    }>;
  }): Promise<Cotizacion>;
  updateCotizacion(
    id: number,
    payload: Partial<{
      proveedor: number;
      codigo_cotizacion: string;
      fecha_validez: string;
      total_propuesto: number;
      detalles: Array<{
        producto: number;
        cantidad: number;
        precio_propuesto: number;
      }>;
    }>,
  ): Promise<Cotizacion>;
  deleteCotizacion(id: number): Promise<void>;
}