const requestPlaceSchema = {
    type: 'object',
    required: ['place_id', 'requested_for'],
    properties: {
      place_id: { type: 'string' },
      requested_for: { type: 'string' },
    }
  }
  
export const requestPlaceOpts = {
    body: requestPlaceSchema,
}