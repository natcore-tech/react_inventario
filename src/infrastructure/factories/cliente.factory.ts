// src/infrastructure/factories/cliente.factory.ts
import { AxiosClienteRepository } from '@/infrastructure/adapters/axios-cliente.repository'
import { ClienteUseCase } from '@/application/use-cases/cliente.use-case'

/**
 * Instancia única del caso de uso de Cliente, ya conectada a su
 * implementación concreta (AxiosClienteRepository). El resto de la app importa
 * `clienteUseCase` y nunca instancia ClienteUseCase ni AxiosClienteRepository directamente.
 */
export const clienteUseCase = new ClienteUseCase(new AxiosClienteRepository())
