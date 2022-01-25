'use strict'

import fp from "fastify-plugin";
import fastifyMultipart from "fastify-multipart";


export default fp(async function (fastify, opts) {
    fastify.register(fastifyMultipart);
})
