import fastify, { FastifyReply } from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from '@/env'
import { fastifyAwilixPlugin } from '@fastify/awilix'

export const app = fastify()

app.register(appRoutes)

app.register(fastifyAwilixPlugin, {
  disposeOnClose: true,
  disposeOnResponse: true,
})

app.setErrorHandler((error, _, reply: FastifyReply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO Here we should log to an external tool like DataDog/NewRelie/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
