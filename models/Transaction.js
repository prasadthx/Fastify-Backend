import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    place: {
        type: mongoose.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    time : { 
        type: Date,
        default : Date.now()
    }
})

export default mongoose.model("Transaction", transactionSchema);