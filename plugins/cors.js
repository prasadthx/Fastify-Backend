'use strict';

import fastifyCors from "fastify-cors";

import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(fastifyCors, {

    })
})
