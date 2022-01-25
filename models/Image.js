import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

export default mongoose.model("Image", imageSchema);