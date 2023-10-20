import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from '@/use-cases/check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-id-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const checkInRequest = {
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 0,
      userLongitude: 0,
    }

    const { checkIn } = await sut.execute(checkInRequest)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const checkInRequest = {
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 0,
      userLongitude: 0,
    }

    await sut.execute(checkInRequest)

    await expect(() => sut.execute(checkInRequest)).rejects.toBeInstanceOf(
      Error,
    )
  })

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const checkInRequest = {
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude: 0,
      userLongitude: 0,
    }

    await sut.execute(checkInRequest)

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute(checkInRequest)

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
