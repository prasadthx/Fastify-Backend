import Customer from '../models/Customer';
import Place from '../models/Place';
import Transaction from '../models/Transaction';

export const createTransaction = async (req, res) => {
    const customer = await Customer.findOne({ email: req.user.data.email });
    if (!customer) {
        return res.status(400).send({ error: 'Invalid Token' });
    }

    let {place_id} = req.body;

    if (!place_id) {
        return res.status(400).send({ error: 'Place ID is required' });
    }

    let place = await Place.findOne({_id : place_id})
    if(!place) {
        return res.status(400).send({ error: "Invalid Place ID" });
    }
    
    place.booked = true;
    await place.save();

    let transaction = new Transaction({place, customer});
    transaction = await transaction.save();

    return res.status(201).send({success: transaction});
}