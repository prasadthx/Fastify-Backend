import fp from "fastify-plugin";
import pk from 'fastify';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;


const prismaPlugin = fp(async  (server, opts) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    server.decorate('prisma', prisma);

    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    })
})

export default prismaPlugin;
