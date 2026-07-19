export interface CotizacionDetalle {
  producto: number; // ID del producto
  cantidad: number;
  precio_propuesto: number;
}

export interface Cotizacion {
  id?: number; // Read-only (auto-incremental)
  proveedor: number; // ID del proveedor
  codigo_cotizacion: string;
  fecha_emision?: string; // Read-only (auto_now_add, ISO DateTime string)
  fecha_validez: string; // Date string (YYYY-MM-DD)
  total_propuesto: number;
  detalles: CotizacionDetalle[];
}