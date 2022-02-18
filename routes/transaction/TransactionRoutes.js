import { createTransaction, getTransactionsByCustomer, getTransactionsByPlace, verifyTransaction } from "../../controllers/TransactionController";
import { getTransactionsSchema, newTransactionOpts } from "../../route_schemas/TransactionRouteSchemas";


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

    fastify.post( '/verifytransaction',
        async function (request, reply){
            return await verifyTransaction( request, reply);
        }
    )

    fastify.get( '/gettransactionsbycustomer',
        {
            preValidation: [fastify.authenticate],
            schema: getTransactionsSchema
        },
        async function (request, reply){
            return await getTransactionsByCustomer( request, reply);
        }
    )

    fastify.post( '/gettransactionsbyplace/:place_id',
        {
            preValidation: [fastify.authenticate],
            schema: getTransactionsSchema
        },
        async function (request, reply){
            return await getTransactionsByPlace( request, reply);
        }
    )
}
