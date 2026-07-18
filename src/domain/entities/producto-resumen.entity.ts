// src/domain/entities/producto-resumen.entity.ts


export interface ProductoResumen {
  id: number
  nombre: string
  precio: string // DRF DecimalField como string
  stock: number
  es_activo: boolean
}