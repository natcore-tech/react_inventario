// src/application/use-cases/venta.use-case.ts
import type { VentaRepository } from '@/domain/ports/venta.repository'
import type { Venta } from '@/domain/entities/venta.entity'
import type { CreateVentaDto, UpdateVentaDto } from '@/application/dtos/venta.dto'

export class VentaUseCase {
  constructor(private readonly repository: VentaRepository) {}

  getVentas(): Promise<Venta[]> {
    return this.repository.getVentas()
  }

  crearVenta(dto: CreateVentaDto): Promise<Venta> {
    return this.repository.crearVenta(dto)
  }

  updateVenta(id: number, dto: UpdateVentaDto): Promise<Venta> {
    return this.repository.updateVenta(id, dto)
  }
}
