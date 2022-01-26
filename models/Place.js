import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
    name : { 
        type: String,
        required: true
    },
    location : {
        type : Object,
        required : true
    },
    vendor : {
        type: mongoose.Types.ObjectId, 
        ref: "Vendor", 
        required: true
    },
    photos :[{
        type: mongoose.Types.ObjectId,
        ref: 'Image'
    }],
    requests :[{
        type: mongoose.Types.ObjectId,
        ref: 'Request'
    }],
    categories : {
        type : [String],
        enum : ['venue', 'food', 'lookups', 'music/dj']
    },
    booked : { 
        type: Boolean,
        default: false
    }
})

placeSchema.index({ location: '2dsphere' })

export default mongoose.model("Place", placeSchema);