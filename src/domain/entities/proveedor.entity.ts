// Ruta: src/domain/entities/proveedor.entity.ts

export interface Proveedor {
  id: number
  nombre: string
  ruc: string
  telefono: string
  email: string
  direccion: string
  es_activo: boolean
  creado_en: string
}
