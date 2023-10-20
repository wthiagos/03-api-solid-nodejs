import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    const { user } = await sut.execute(userRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    const { user } = await sut.execute(userRequest)

    const isPasswordCorrectlyHashed = await compare(
      userRequest.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    await sut.execute(userRequest)

    await expect(() => sut.execute(userRequest)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
