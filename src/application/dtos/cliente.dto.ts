// src/application/dtos/cliente.dto.ts

/**
 * Datos requeridos para CREAR un cliente.
 * Mapea los campos write del ClienteSerializer de Django.
 *   - `email`     → string | null  (null=True, blank=True → puede ser null)
 *   - `telefono`  → string         (blank=True pero NOT null → cadena vacía si no aplica)
 *   - `direccion` → string         (blank=True pero NOT null → cadena vacía si no aplica)
 */
export interface CreateClienteDto {
  identificacion: string
  nombres: string
  email: string | null
  telefono: string
  direccion: string
  es_activo: boolean
}

/**
 * Datos para ACTUALIZAR un cliente (PATCH).
 * Todos los campos son opcionales.
 */
export type UpdateClienteDto = Partial<CreateClienteDto>
