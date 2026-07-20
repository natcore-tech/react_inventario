// src/domain/entities/numero-serie.entity.ts

export type EstadoNumeroSerie = 'DISPONIBLE' | 'VENDIDO' | 'DANO'

export const ESTADO_NUMERO_SERIE_LABELS: Record<EstadoNumeroSerie, string> = {
  DISPONIBLE: 'Disponible',
  VENDIDO: 'Vendido',
  DANO: 'Dañado',
}


export interface NumeroSerie {
  id: number
  producto: number
  codigo_serial: string
  estado: EstadoNumeroSerie
  fecha_ingreso: string
}