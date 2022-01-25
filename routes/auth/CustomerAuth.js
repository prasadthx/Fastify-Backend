import { signUp, login, verifyCustomerEmail } from '../../controllers/CustomerController'

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

    fastify.post("/customer/signup", {schema : signUpOpts}, async function (request, reply){
        return await signUp(request, reply)  
    })

    fastify.post("/customer/login", {schema : loginOpts}, async function (request, reply){
        return await login(fastify, request, reply)
    })

    fastify.post("/customer/sendverificationtoken", async function (request, reply){
      return await sendVerificationToken(fastify, request, reply);
    })

    fastify.get("/customer/verifyemail", async function (request, reply){
      return await verifyCustomerEmail(fastify, request, reply);
    }) 

    fastify.get("/getcustomer",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request, reply) {
        return request.user.data;
      }
    )
}
