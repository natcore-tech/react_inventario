// src/domain/entities/traslado-bodega-detalle.entity.ts

/**
 * Entidad de dominio para TrasladoBodegaDetalle.
 * Refleja exactamente los campos expuestos por TrasladoBodegaDetalleSerializer:
 *   fields = ['id', 'traslado', 'producto', 'cantidad']
 *
 * NOTA: Esta entidad no tiene endpoint propio en el router de Django.
 * Sus registros se acceden anidados dentro de GET /traslados-bodegas/
 * como el campo 'detalles' del TrasladoBodegaSerializer.
 *
 * 'traslado' y 'producto' son FKs (IDs numéricos).
 * 'traslado' es read_only en el serializer (asignado automáticamente al crear).
 */
export interface TrasladoBodegaDetalle {
  id: number
  traslado: number
  producto: number
  cantidad: number
}
