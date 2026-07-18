// Ruta: src/infrastructure/factories/proveedor.factory.ts

import { AxiosProveedorRepository } from '../adapters/axios-proveedor.repository'
import { ProveedorUseCase } from '../../application/use-cases/proveedor.use-case'

const proveedorRepository = new AxiosProveedorRepository()

export const proveedorUseCase = new ProveedorUseCase(proveedorRepository)