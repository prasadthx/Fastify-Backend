import mongoose from 'mongoose';

const customerSchema = mongoose.Schema({
    name : String,
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password : { 
        type : String,
        required : true
    },
    createdAt : {
        type: Date,
        default : Date.now()
    },
    updatedAt : {
        type: Date,
        default : Date.now()
    },
    verified : Boolean
})

export default mongoose.model('Customer', customerSchema);

