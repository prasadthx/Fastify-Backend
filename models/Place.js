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
    photos : { 
        type : [Buffer]
    },
    categories : {
        type : [String],
        enum : ['venue', 'food', 'lookups', 'music/dj']
    }
})

placeSchema.index({ location: '2dsphere' })

export default mongoose.model("Place", placeSchema);