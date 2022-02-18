const newTransactionSchema = {
    type: 'object',
    required: ['place_id'],
    properties: {
      place_id: { type: 'string' },
    }
}

const headerSchema = {
  type: 'object',
  properties: {
    'authorization': { type: 'string' }
  },
  required: ['authorization']
}
  
export const newTransactionOpts = {
    body: newTransactionSchema,
}

export const getTransactionsSchema = {
    headers: headerSchema,
}