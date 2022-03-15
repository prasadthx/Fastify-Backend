import fp from "fastify-plugin";
import Vendor from "../models/Vendor";

export default fp(async function (fastify, opts) {
    fastify
        .decorate("authorize_vendor", async function(request, reply) {
            try {
              const vendor = await Vendor.findOne({email:request.user.user.email});
              if(!vendor.isSubscribed) {
                reply.code(400).send({error:"Not Subscribed"});
              }
            } catch (err) {
              reply.send(err);
            }
        })
})
