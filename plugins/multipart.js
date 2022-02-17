'use strict'

import fp from "fastify-plugin";
import multer from "fastify-multer";


export default fp(async function (fastify, opts) {
    // fastify.register(fastifyMultipart);
    fastify.register(multer.contentParser);
})
