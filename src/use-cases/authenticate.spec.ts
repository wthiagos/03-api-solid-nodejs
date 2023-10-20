import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const userRequest = {
      email: 'teste@teste.com',
      password: '123456',
    }

    await usersRepository.create({
      name: 'Teste',
      email: userRequest.email,
      password_hash: await hash(userRequest.password, 6),
    })

    const { user } = await sut.execute(userRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const userRequest = {
      email: 'teste@teste.com',
      password: '123456',
    }

    await expect(() => sut.execute(userRequest)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userRequest = {
      email: 'teste@teste.com',
      password: '123456',
    }

    await usersRepository.create({
      name: 'Teste',
      email: userRequest.email,
      password_hash: await hash('123123', 6),
    })

    await expect(() => sut.execute(userRequest)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })
})
