import FastifyJWT from 'fastify-jwt';
import fp from "fastify-plugin";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export default fp(async function (fastify, opts) {
    fastify
        .register(FastifyJWT, {
            secret: JWT_SECRET
        })
        .decorate("authenticate", async function(request, reply) {
            try {
              await request.jwtVerify()
            } catch (err) {
              reply.send(err)
            }
        })
})
