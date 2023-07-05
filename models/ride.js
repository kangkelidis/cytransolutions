import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    cash: {
        type: Number,
    },
    credit: {
        type: Number
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema)