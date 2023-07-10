import mongoose from "mongoose";

const tablesSchema = new mongoose.Schema({
    clients: {
        type: Number
    },
    drivers: {
        type: Number
    },
    rides: {
        type: Number
    },

})

export default mongoose.models.Tables || mongoose.model('Tables', tablesSchema)