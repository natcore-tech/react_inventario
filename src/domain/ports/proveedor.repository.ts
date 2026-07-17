// Ruta: src/domain/ports/proveedor.repository.ts

import type { Proveedor } from '../entities/proveedor.entity'

export interface ProveedorRepository {
  getProveedores(): Promise<Proveedor[]>
  getProveedor(id: number): Promise<Proveedor>

  createProveedor(payload: {
    nombre: string
    ruc: string
    telefono?: string
    email?: string
    direccion?: string
    es_activo?: boolean
  }): Promise<Proveedor>

  updateProveedor(
    id: number,
    payload: Partial<{
      nombre: string
      ruc: string
      telefono: string
      email: string
      direccion: string
      es_activo: boolean
    }>,
  ): Promise<Proveedor>

  deleteProveedor(id: number): Promise<void>
}