import { signUp, login } from '../controllers/authController'

const signUpSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' },
  }
}

const signUpOpts = {
  body: signUpSchema,
}

const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  }
}

const loginOpts = {
  body: loginSchema,
}

export default async function authRoutes ( fastify, opts ){

    fastify.post("/signup", {schema : signUpOpts}, async function (request, reply){
        return await signUp(fastify.prisma, request, reply)  
    })

    fastify.post("/login", {schema : loginOpts}, async function (request, reply){
        return await login(fastify, request, reply)
    })

    fastify.get("/getuser",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request, reply) {
        return request.user.data;
      }
    )
}
