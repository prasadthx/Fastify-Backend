import { signUp, login, sendVerificationToken,verifyVendorEmail, uploadProfilePhoto } from '../../controllers/VendorController'

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

    fastify.get("/getvendor",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request, reply) {
        return request.user.data;
      }
    )
}
