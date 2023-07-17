import mongoose from "mongoose";

const invoicesSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
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
    rides: [
        { type : mongoose.Schema.Types.ObjectId, 
        ref: 'Ride' }
    ],
    total: {
        type: Number,
        default: 0
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

export default mongoose.models.Invoices || mongoose.model('Invoices', invoicesSchema)
