import type { CreateCotizacionDto } from '../dtos/create-cotizacion.dto';
import type { UpdateCotizacionDto } from '../dtos/update-cotizacion.dto';
import type { Cotizacion } from '../../domain/entities/cotizacion.entity';
import type { CotizacionRepository } from '../../domain/ports/cotizacion.repository';

export class CotizacionUseCase {
  constructor(private readonly cotizacionRepository: CotizacionRepository) {}

  async getCotizaciones(page?: number, search?: string): Promise<{ count: number; results: Cotizacion[] }> {
    return this.cotizacionRepository.getCotizaciones(page, search);
  }

  async getCotizacion(id: number): Promise<Cotizacion> {
    return this.cotizacionRepository.getCotizacion(id);
  }

  async createCotizacion(dto: CreateCotizacionDto): Promise<Cotizacion> {
    return this.cotizacionRepository.createCotizacion(dto);
  }

  async updateCotizacion(id: number, dto: UpdateCotizacionDto): Promise<Cotizacion> {
    return this.cotizacionRepository.updateCotizacion(id, dto);
  }

  async deleteCotizacion(id: number): Promise<void> {
    return this.cotizacionRepository.deleteCotizacion(id);
  }
}