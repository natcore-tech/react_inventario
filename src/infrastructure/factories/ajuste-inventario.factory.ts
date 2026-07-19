// src/infrastructure/factories/ajuste-inventario.factory.ts
import { AxiosAjusteInventarioRepository } from '@/infrastructure/adapters/axios-ajuste-inventario.repository'
import { AjusteInventarioUseCase } from '@/application/use-cases/ajuste-inventario.use-case'

export const ajusteInventarioUseCase = new AjusteInventarioUseCase(new AxiosAjusteInventarioRepository())