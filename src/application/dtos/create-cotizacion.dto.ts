export interface CreateCotizacionDetalleDto {
  producto: number;
  cantidad: number;
  precio_propuesto: number;
}

export interface CreateCotizacionDto {
  proveedor: number;
  codigo_cotizacion: string;
  fecha_validez: string;
  total_propuesto: number;
  detalles: CreateCotizacionDetalleDto[];
}