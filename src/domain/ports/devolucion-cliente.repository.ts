// src/domain/ports/devolucion-cliente.repository.ts
import type { DevolucionCliente } from '../entities/devolucion-cliente.entity'
import type { CreateDevolucionClienteDto } from '@/application/dtos/create-devolucion-cliente.dto'
import type { UpdateDevolucionClienteDto } from '@/application/dtos/update-devolucion-cliente.dto'

export interface DevolucionClienteRepository {
  getDevoluciones(): Promise<DevolucionCliente[]>
  createDevolucion(dto: CreateDevolucionClienteDto): Promise<DevolucionCliente>
  /**
   * SOLO motivo es editable — ver nota en la entidad: producto/cantidad/
   * estado_producto ya surtieron su efecto en el stock (o no) al crear,
   * y editarlos después no vuelve a recalcular nada en el backend.
   */
  updateDevolucion(id: number, dto: UpdateDevolucionClienteDto): Promise<DevolucionCliente>
  // Sin deleteDevolucion(): mismo motivo que AjusteInventario — es un
  // registro histórico y borrar no revierte el reingreso de stock ya aplicado.
}