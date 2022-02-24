import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify
        .decorate("authorize_vendor", async function(request, reply) {
            try {
              const vendor = await request.user;
              if(!vendor.isSubscribed) {
                reply.send({error:"Not Subscribed"});
              }
            } catch (err) {
              reply.send(err);
            }
        })
})
