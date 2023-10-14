import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from '@/use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(userRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(userRequest)

    const isPasswordCorrectlyHashed = await compare(
      userRequest.password,
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const userRequest = {
      name: 'Teste',
      email: 'teste@teste.com',
      password: '123456',
    }

    await registerUseCase.execute(userRequest)

    await expect(() =>
      registerUseCase.execute(userRequest),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
