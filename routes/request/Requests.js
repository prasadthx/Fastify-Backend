import { requestPlace, deleteRequest } from '../../controllers/RequestController';

export default async function requestRoutes ( fastify, opts ){
    fastify.post( '/requestplace',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await requestPlace( request, reply);
        }
    )
    fastify.delete( '/deleterequest/:request_id',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await deleteRequest( request, reply);
        }
    )
}
