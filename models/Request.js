import mongoose from 'mongoose';

const requestSchema = mongoose.Schema({
    place: { 
        type: mongoose.Types.ObjectId,
        ref: 'Place',
        required: true   
    },
    requested_by: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    requested_at: {
        type: Date,
        default : Date.now(),
        required: true
    },
    requested_for: {
        type: Date,
        required: true
    }
})

export default mongoose.model("Request", requestSchema);