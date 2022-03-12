import { signUp, login, sendVerificationToken,verifyVendorEmail, uploadProfilePhoto, createSubscription, verifyPayment, changeVendorStatus } from '../../controllers/VendorController'
import { createSubscriptionSchema, verifyPaymentSchema } from '../../route_schemas/VendorAuthSchemas';

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

    fastify.post("/vendor/signup", {schema : signUpOpts}, async function (request, reply){
        return await signUp(fastify, request, reply)  
    })

    fastify.post("/vendor/login", {schema : loginOpts}, async function (request, reply){
        return await login(fastify, request, reply)
    })

    fastify.post("/vendor/sendverificationtoken", async function (request, reply){
        return await sendVerificationToken(fastify, request, reply);
    })

    fastify.get("/vendor/verifyemail", async function (request, reply){
        return await verifyVendorEmail(fastify, request, reply);
    }) 
    
    fastify.post("/vendor/uploadphoto",
    {
      preHandler: fastify.multer.parser.single('upload'),
      preValidation: [fastify.authenticate],
    }, 
    async function (request, reply){
        return await uploadProfilePhoto(request, reply);
    })
    
    fastify.post("/vendor/createsubscription",
    {
      preValidation: [fastify.authenticate],
      schema : createSubscriptionSchema
    }, 
    async function (request, reply){
        return await createSubscription(request, reply);
    })

    fastify.post("/vendor/verifypayment",
    {
      preValidation: [fastify.authenticate],
      schema : verifyPaymentSchema
    }, 
    async function (request, reply){
        return await verifyPayment(request, reply);
    })

    fastify.get("/getvendor",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request, reply) {
        return request.user.user;
      }
    )

    fastify.get("/changevendorstatus",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request, reply) {
        return await changeVendorStatus(request, reply);
      }
    )
}
