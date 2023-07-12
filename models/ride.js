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
        ref: "Driver",
        required: true
    },
    passenger: {
        type: String,
    },
    from: {
        type: String,
        required: false,
    },
    to: {
        type: String,
        required: false
    },
    notes: {
        type: String,
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
    count: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema)