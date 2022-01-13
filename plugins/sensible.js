'use strict'

import fastify_sensible from "fastify-sensible";

import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(fastify_sensible, {
        errorHandler: false
    })
})
