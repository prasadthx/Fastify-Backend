const createPlaceSchema = {
    type: 'object',
    required: ['name', 'location', 'categories'],
    properties: {
      name: { type: 'string' },
      location: { 
          type: 'string' 
        },
      categories: { 
        type: 'array',
        maxItems: 4,
            items: { 
                type: 'string' ,
                enum: ['venue', 'food', 'lookups', 'music/dj'] 
            }
        },
    }
}

const updatePlaceSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      location: { 
          type: 'string' 
        },
      categories: { 
        type: 'array',
        maxItems: 4,
            items: { 
                type: 'string' ,
                enum: ['venue', 'food', 'lookups', 'music/dj'] 
            }
        },
    }
}

const getNearPlaceSchema = {
    type: 'object',
    required: ['longitude', 'latitude'],
    properties: {
      longitude: { type: 'number' },
      latitude: { type: 'number' }
    }
  }
  
export const createPlaceOpts = {
    body: createPlaceSchema,
}

export const updatePlaceOpts = {
    body: updatePlaceSchema
}

export const getNearPlaceOpts = {
    querystring : getNearPlaceSchema
}
  