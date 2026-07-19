// src/domain/entities/devolucion-cliente.entity.ts

export type EstadoProductoDevolucion = 'BUENO' | 'DANO' | 'USADO'

export const ESTADO_PRODUCTO_DEVOLUCION_LABELS: Record<EstadoProductoDevolucion, string> = {
  BUENO: 'Buen Estado',
  DANO: 'Dañado',
  USADO: 'Usado',
}

/**
 * Devolución de cliente tal como la devuelve DevolucionClienteSerializer.
 *
 * Nota: `producto` viene como ID plano (number), NO anidado — mismo patrón
 * que el resto de entidades (fields = '__all__').
 *
 * Efecto en stock: una señal post_save reingresa `cantidad` al stock del
 * producto SOLO si estado_producto === 'BUENO' Y SOLO en la creación
 * (created=True). Editar una devolución ya existente NO vuelve a disparar
 * ese reingreso — por eso el frontend restringe la edición a `motivo`.
 */
export interface DevolucionCliente {
  id: number
  producto: number
  fecha_devolucion: string
  motivo: string
  cantidad: number
  estado_producto: EstadoProductoDevolucion
}