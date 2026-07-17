// src/domain/entities/traslado-bodega.entity.ts

/**
 * Sub-entidad anidada para cada línea de detalle del traslado.
 * Derivada de TrasladoBodegaDetalleSerializer (nested en TrasladoBodegaSerializer).
 */
export interface TrasladoBodegaDetalle {
  id: number
  producto: number
  cantidad: number
}

/**
 * Entidad de dominio para TrasladoBodega.
 * Refleja exactamente los campos expuestos por TrasladoBodegaSerializer:
 *   fields = ['id', 'fecha_traslado', 'bodega_origen', 'bodega_origen_nombre',
 *             'bodega_destino', 'bodega_destino_nombre', 'estado', 'detalles']
 *
 * 'bodega_origen' y 'bodega_destino' son las FKs (IDs numéricos).
 * 'estado' refleja los choices del modelo: EN_TRANSITO | COMPLETADO | CANCELADO.
 * 'detalles' es el array anidado de líneas del traslado.
 */
export interface TrasladoBodega {
  id: number
  /** Fecha y hora del traslado en formato ISO 8601 (auto_now_add=True en Django). */
  fecha_traslado: string
  bodega_origen: number
  bodega_origen_nombre: string
  bodega_destino: number
  bodega_destino_nombre: string
  estado: 'EN_TRANSITO' | 'COMPLETADO' | 'CANCELADO'
  detalles: TrasladoBodegaDetalle[]
}
