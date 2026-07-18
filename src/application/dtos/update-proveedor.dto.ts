// Ruta: src/application/dtos/update-proveedor.dto.ts

export interface UpdateProveedorDto {
  nombre?: string
  ruc?: string
  telefono?: string
  email?: string
  direccion?: string
  es_activo?: boolean
}