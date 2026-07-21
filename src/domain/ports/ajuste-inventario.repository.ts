// src/domain/ports/ajuste-inventario.repository.ts
import type { AjusteInventario } from '../entities/ajuste-inventario.entity'
import type { CreateAjusteInventarioDto } from '@/application/dtos/create-ajuste-inventario.dto'
import type { UpdateAjusteInventarioDto } from '@/application/dtos/update-ajuste-inventario.dto'

export interface AjusteInventarioRepository {
  /** GET /ajustes-inventario/ — lista completa (desenvuelta si viene paginada). */
  getAjustes(): Promise<AjusteInventario[]>
  /** POST /ajustes-inventario/ — el backend recalcula el stock del producto. */
  createAjuste(dto: CreateAjusteInventarioDto): Promise<AjusteInventario>
  /**
   * PATCH /ajustes-inventario/:id/ — SOLO tipo_ajuste/justificativo.
   * No se expone producto/cantidad: el serializer no tiene update() propio,
   * así que editar esos campos desincronizaría el stock ya aplicado en create().
   */
  updateAjuste(id: number, dto: UpdateAjusteInventarioDto): Promise<AjusteInventario>
  // Sin deleteAjuste(): bitácora legal + el ViewSet no revierte stock al borrar.
}