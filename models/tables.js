import mongoose from "mongoose";

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
    }

})

export default mongoose.models.Tables || mongoose.model('Tables', tablesSchema)