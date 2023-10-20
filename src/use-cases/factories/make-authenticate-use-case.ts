import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'

export const makeAuthenticateUseCase = (): AuthenticateUseCase => {
  const prismaUsersRepository = new PrismaUsersRepository()
  return new AuthenticateUseCase(prismaUsersRepository)
}
