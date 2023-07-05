import mongoose from "mongoose";
import validator from 'validator'

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "Driver already exists"]
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema)