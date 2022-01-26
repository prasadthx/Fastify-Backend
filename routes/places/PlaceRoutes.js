import {createPlace, updatePlace, deletePlace, getPlace, getPlacesWithin, uploadPhotos, getPhotos,getPlacesByVendor} from '../../controllers/PlacesController'
import { createPlaceOpts, updatePlaceOpts, getNearPlaceOpts } from '../../route_schemas/PlaceRouteSchemas';

export default async function placeRoutes ( fastify, opts ){
    
    fastify.post( '/createplace',
        {
            preValidation: [fastify.authenticate],
            schema:createPlaceOpts
        },
        async function (request, reply){
            return await createPlace( request, reply);
    })

    fastify.put( '/updateplace/:place_id',
        {
            preValidation: [fastify.authenticate],
            schema:updatePlaceOpts
        },
        async function (request, reply){
            return await updatePlace( request, reply);
    })

    fastify.delete( '/deleteplace/:place_id',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await deletePlace( request, reply);
    })

    fastify.get('/getplace/:place_id', async function (request, reply){
        return await getPlace( request, reply);
    })

    fastify.get( '/getplacesbyvendor',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await getPlacesByVendor( request, reply);
    })

    fastify.get( '/placeswithin/:sorted', {schema:getNearPlaceOpts},async function (request, reply){
        return await getPlacesWithin( request, reply);
    })

    fastify.post( '/uploadphotos/:place_id', 
        {
            preHandler: fastify.multer.parser.array('upload'),
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await uploadPhotos( request, reply);
    })

    fastify.get( '/getphotos/:place_id', 
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await getPhotos( request, reply);
    })
}