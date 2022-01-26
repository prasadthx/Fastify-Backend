import Customer from '../models/Customer';
import Request from '../models/Request';
import Place from '../models/Place';
import Vendor from '../models/Vendor';

export const requestPlace = async (req, res) => {
    let { place_id, requested_for } = req.body;
    if (!place_id) {
        return res.status(400).send({ error: 'Place ID is required' });
    }

    let place = await Place.findOne({_id : place_id})
    if(!place) {
        return res.status(400).send({ error: "Invalid Place ID" });
    }
    
    const customer = await Customer.findOne({ email: req.user.data.email });
    if (!customer) {
        return res.status(400).send({ error: 'Invalid Token' });
    }

    let request = new Request({
        place : place,
        requested_by : customer,
        requested_for : requested_for
    })

    request = await request.save();
    place.requests.push(request);
    await place.save();
    return res.code(201).send({success : "Request created"});
}

export const deleteRequest = async (req, res) => {
    let request_id = req.params.request_id;
    const vendor = await Vendor.findOne({ email: req.user.data.email });
    const customer = await Customer.findOne({ email: req.user.data.email });
    let request = await Request.findOne({_id : request_id});
    let place = await Place.findOne({_id : request.place}).populate("vendor");

    if(!request) {
        return res.status(401).send({ error: 'Invalid Request ID' });
    }

    if(vendor){
        if(!place || place.vendor.email !== vendor.email) {
            return res.status(401).send({ error: "Not authorized" });;
        }
    }
    else if(customer){
        if(!place || request.requested_by !== customer._id) {
            return res.status(401).send({ error: "Not authorized" });;
        }
    }

    for( let it = 0; it < place.requests.length; it++){ 
        if ( place.requests[it] === request_id) { 
            place.requests.splice(it, 1); 
        }
    }

    await place.save();
    await request.delete();
    
    return res.code(200).send({success : 'Request deleted successfully'});
}