import mongoose from "mongoose";

const invoicesSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        default: "open",
        enum: {
            values: [
                "open",
                "closed",
                "issued",
                "paid",
            ]
        }
    },
    count: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.models.Invoices || mongoose.model('Invoices', invoicesSchema)