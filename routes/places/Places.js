import {createPlace, updatePlace, deletePlace, getPlace, getPlacesWithin, uploadPhotos, getPhotos,getPlacesByVendor} from '../../controllers/PlacesController'

export default async function placeRoutes ( fastify, opts ){
    
    fastify.post( '/createplace',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await createPlace( request, reply);
    })

    fastify.put( '/updateplace/:id',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await updatePlace( request, reply);
    })

    fastify.delete( '/deleteplace/:id',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await deletePlace( request, reply);
    })

    fastify.get('/getplace/:id', async function (request, reply){
        return await getPlace( request, reply);
    })

    fastify.get( '/getplacesbyvendor',
        {
            preValidation: [fastify.authenticate]
        },
        async function (request, reply){
            return await getPlacesByVendor( request, reply);
    })

    fastify.get( '/placeswithin/:sorted', async function (request, reply){
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