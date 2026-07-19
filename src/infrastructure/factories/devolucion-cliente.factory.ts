// src/infrastructure/factories/devolucion-cliente.factory.ts
import { AxiosDevolucionClienteRepository } from '@/infrastructure/adapters/axios-devolucion-cliente.repository'
import { DevolucionClienteUseCase } from '@/application/use-cases/devolucion-cliente.use-case'

export const devolucionClienteUseCase = new DevolucionClienteUseCase(new AxiosDevolucionClienteRepository())