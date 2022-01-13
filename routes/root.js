export default async function ( fastify, opts ){
    fastify.get("/name", async function (request, reply){
        return {"Hello" : "World"};
    })
}
