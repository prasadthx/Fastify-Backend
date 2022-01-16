'use strict'

import FastifySwagger from 'fastify-swagger';

import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(FastifySwagger, {
        exposeRoute:true,
        routePrefix : '/docs',
        swagger:{ 
            info: {title:'backend-api'}
        }
    })
})