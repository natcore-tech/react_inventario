// src/infrastructure/factories/usuario-admin.factory.ts
import { AxiosUsuarioAdminRepository } from '@/infrastructure/adapters/axios-usuario-admin.repository'
import { UsuarioAdminUseCase } from '@/application/use-cases/usuario-admin.use-case'

export const usuarioAdminUseCase = new UsuarioAdminUseCase(
  new AxiosUsuarioAdminRepository(),
)
