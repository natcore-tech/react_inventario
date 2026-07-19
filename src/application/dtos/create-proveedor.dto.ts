// Ruta: src/application/dtos/create-proveedor.dto.ts

export interface CreateProveedorDto {
  nombre: string
  ruc: string
  telefono?: string
  email?: string
  direccion?: string
  es_activo?: boolean
}