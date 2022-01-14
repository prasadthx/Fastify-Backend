import fp from "fastify-plugin";
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const prismaPlugin = fp(async  (fastify, opts) => {
    const prisma = new PrismaClient();

    await prisma.$connect();

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    })
})

export default prismaPlugin;
