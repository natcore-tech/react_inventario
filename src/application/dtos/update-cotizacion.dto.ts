export interface UpdateCotizacionDetalleDto {
  producto?: number;
  cantidad?: number;
  precio_propuesto?: number;
}

import { CreateCotizacionDetalleDto } from './create-cotizacion.dto';

export interface UpdateCotizacionDto {
  proveedor?: number;
  codigo_cotizacion?: string;
  fecha_validez?: string;
  total_propuesto?: number;
  detalles?: CreateCotizacionDetalleDto[];
}