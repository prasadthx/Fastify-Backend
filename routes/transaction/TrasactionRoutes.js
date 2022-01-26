import { createTransaction } from "../../controllers/TransactionController";
import { newTransactionOpts } from "../../route_schemas/TransactionRouteSchemas";


export default async function requestRoutes ( fastify, opts ){
    fastify.post( '/newtransaction',
        {
            preValidation: [fastify.authenticate],
            schema:newTransactionOpts
        },
        async function (request, reply){
            return await createTransaction( request, reply);
        }
    )
}
