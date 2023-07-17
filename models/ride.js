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
        default: 0
    },
    credit: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoices"
    },
    count: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }} )

rideSchema.post("validate", function(doc) {
    doc.total = doc.credit + doc.cash
})

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema)