import mongoose from "mongoose";
import validator from 'validator'

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Client already exists"]
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    address: {
        type: String,
    },
    tel: {
        type: String,
    },
    notes: {
        type: String,
    },
    count: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.models.Client || mongoose.model('Client', clientSchema)