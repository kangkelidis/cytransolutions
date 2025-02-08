import mongoose from "mongoose";
import invoices from "./invoices";

const tablesSchema = new mongoose.Schema({
    clients: {
        type: Number,
        default: 0
    },
    drivers: {
        type: Number,
        default: 0
    },
    rides: {
        type: Number,
        default: 0
    },
    locations: {
        type: Number,
        default: 0
    },
    custom_invoices: {
        type: Number,
        default: 0
    },

})

export default mongoose.models.Tables || mongoose.model('Tables', tablesSchema)