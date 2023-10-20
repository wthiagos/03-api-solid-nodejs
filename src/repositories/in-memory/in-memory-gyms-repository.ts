import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((g) => g.id === id)

    if (!gym) return null

    return gym
  }
}
