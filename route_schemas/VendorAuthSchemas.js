const newSubscriptionSchema = {
    type: 'object',
    required: ['amount', 'currency'],
    properties: {
      amount: { type: 'number' },
      currency: { type: 'string' },
    }
}

const verifyPaymentBodySchema = {
    type: 'object',
    required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'],
    properties: {
      razorpay_order_id: { type: 'string' },
      razorpay_payment_id: { type: 'string' },
      razorpay_signature: { type: 'string' },
    }
}

const headerSchema = {
  type: 'object',
  properties: {
    'authorization': { type: 'string' }
  },
  required: ['authorization']
}

export const createSubscriptionSchema = {
    headers: headerSchema,
    body: newSubscriptionSchema
}

export const verifyPaymentSchema = {
    headers: headerSchema,
    body: verifyPaymentBodySchema
}