// src/application/dtos/turno-caja.dto.ts
import type { EstadoTurno } from '@/domain/entities/turno-caja.entity'

/**
 * Datos requeridos para ABRIR un turno de caja (POST).
 * El backend se encarga de asignar el cajero logueado, la fecha_apertura
 * y el estado por defecto a 'ABIERTO'.
 */
export interface CreateTurnoCajaDto {
  monto_apertura: number
}

/**
 * Datos requeridos para CERRAR un turno de caja (PATCH).
 * El backend requiere que el estado sea 'CERRADO' y que se envíe el monto_cierre.
 */
export interface CloseTurnoCajaDto {
  estado: Extract<EstadoTurno, 'CERRADO'>
  monto_cierre: number
  observaciones?: string
}
