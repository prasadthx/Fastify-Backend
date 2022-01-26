import { requestPlace, deleteRequest } from '../../controllers/RequestController';
import { requestPlaceOpts } from '../../route_schemas/RequestRouteSchemas';

export default async function requestRoutes ( fastify, opts ){
    fastify.post( '/requestplace',
        {
            preValidation: [fastify.authenticate],
            schema:requestPlaceOpts
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
