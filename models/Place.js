import mongoose from 'mongoose';

const placeSchema = mongoose.Schema({
    name : String,
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
    }
})

placeSchema.index({ location: '2dsphere' })

export default mongoose.model("Place", placeSchema);