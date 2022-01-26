const newTransactionSchema = {
    type: 'object',
    required: ['place_id'],
    properties: {
      place_id: { type: 'string' },
    }
  }
  
export const newTransactionOpts = {
    body: newTransactionSchema,
}