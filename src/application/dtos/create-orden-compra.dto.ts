// Ruta: src/application/dtos/create-orden-compra.dto.ts

export interface CreateDetalleCompraDto {
  producto: number
  cantidad: number
  precio_unitario_compra: number
}

export interface CreateOrdenCompraDto {
  codigo_orden: string
  proveedor: number
  detalles: CreateDetalleCompraDto[]
  // total_estimado NO va aqui: se calcula automaticamente en el use-case
  // sumando (cantidad * precio_unitario_compra) de cada detalle, para que
  // nunca quede desincronizado del total real de los items.
}