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
    },
    order_id : { 
        type : String,
    },
    payment_id : { 
        type : String,
    },
    status : { 
        type : String,
    },
    amount : { 
        type : Number,
    }
})

export default mongoose.model("Transaction", transactionSchema);