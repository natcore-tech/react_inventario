// Ruta: src/infrastructure/factories/orden-compra.factory.ts

import { AxiosOrdenCompraRepository } from '../adapters/axios-orden-compra.repository'
import { OrdenCompraUseCase } from '../../application/use-cases/orden-compra.use-case'

const ordenCompraRepository = new AxiosOrdenCompraRepository()

export const ordenCompraUseCase = new OrdenCompraUseCase(ordenCompraRepository)