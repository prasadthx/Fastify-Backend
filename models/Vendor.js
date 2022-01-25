import mongoose from 'mongoose';

export const vendorSchema = mongoose.Schema({
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
    adhaarCard : { 
        type: String,
        immutable: true
    },
    photo : {
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    },
    verified : Boolean,
    phoneNumber : String
})

export default mongoose.model("Vendor", vendorSchema);