// src/application/dtos/metodo-pago.dto.ts

/**
 * Datos requeridos para CREAR un método de pago.
 * Mapea los campos write del MetodoPagoSerializer de Django.
 */
export interface CreateMetodoPagoDto {
  nombre: string
  es_activo: boolean
}

/**
 * Datos para ACTUALIZAR un método de pago (PATCH).
 * Todos los campos son opcionales.
 */
export type UpdateMetodoPagoDto = Partial<CreateMetodoPagoDto>
