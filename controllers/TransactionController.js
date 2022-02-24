import Customer from '../models/Customer';
import Place from '../models/Place';
import Transaction from '../models/Transaction';
import RazorpayInstance from '../utils/payment';
import Razorpay from 'razorpay'

export const createTransaction = async (req, res) => {
    const customer = await Customer.findOne({ email: req.user.user.email });
    if (!customer) {
        return res.status(400).send({ error: 'Invalid Token' });
    }

    let {place_id, amount, currency} = req.body;

    if (!place_id) {
        return res.status(400).send({ error: 'Place ID is required' });
    }

    let place = await Place.findOne({_id : place_id})
    if(!place) {
        return res.status(400).send({ error: "Invalid Place ID" });
    }

    if (!amount || !currency) {
        return res.status(400).send({ error: 'Amount and currency must be provided' });
    }
    
    let transaction = new Transaction({place, customer});
    transaction = await transaction.save();

    let options = {
        amount: amount * 100,  
        currency: currency,
        receipt: `receipt_id_${transaction._id}`
    };

    try{
        const response = await RazorpayInstance.orders.create(options);

        transaction.order_id = response.id;
        transaction.time = response.created_at;

        await transaction.save();
        
        return res.status(200).send({
            order_id : response.id,
            currency : response.currency,
            amount : response.amount
        });
    }
    catch(err){
        return res.status(400).send({error: err});
    }
}

export const verifyTransaction = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

	const signature = req.headers["x-razorpay-signature"];

    const reqBody = req.body;

    if(Razorpay.validateWebhookSignature(reqBody, signature, secret)){
        const order_id = req.body.payload.payment.order_id;
        const transaction = Transaction.findOne({order_id});

        if(!transaction){
            return res.code(200).send({Error: 'No such transaction'});
        }

        transaction.payment_id = req.body.payload.payment.id;
        transaction.amount = req.body.payload.payment.amount;
        transaction.status = req.body.payload.payment.status;

        await transaction.save();
        
        return res.code(200).send({success: true});
    }
	else {
		return res.code(200).send({Error: 'WebHook Parameters Mismatch'});
	}
}

export const getTransactionsByCustomer = async (req, res) => {
    const customer = await Customer.findOne({ email: req.user.user.email });

    if (!customer) {
        return res.status(400).send({ error: 'Invalid Token' });
    }

    const result = await Transaction.find({customer: customer._id})

    return res.code(200).send({result});
}

export const getTransactionsByPlace = async (req, res) => {
    let place = await Place.findOne({_id : req.params.place_id});
    
    if(!place){
        return res.status(400).send({ error: "Invalid Place ID" });
    }

    const result = await Transaction.find({place: place._id});

    return res.code(200).send({result});
}