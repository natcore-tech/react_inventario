// src/domain/entities/turno-caja.entity.ts

export type EstadoTurno = 'ABIERTO' | 'CERRADO'

export interface TurnoCaja {
  id: number
  cajero: number
  nombre_cajero: string
  fecha_apertura: string
  fecha_cierre: string | null
  monto_apertura: string // Decimal devuelto como string por la API
  monto_cierre: string | null
  estado: EstadoTurno
  observaciones: string
}
