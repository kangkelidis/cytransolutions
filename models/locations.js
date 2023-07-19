import mongoose from "mongoose";
import Tables from "./tables";

const locationsSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true, 
        trim: true,
        required: true,
        unique: [true, "location already exists"]
    },
    count: {
        type: Number,
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    },
})


locationsSchema.post("validate", async function(doc) {
    try {
        const tables = await Tables.findOne({})
        doc.count = tables.locations + 1

    } catch (e) {
        console.log("locations model post validation: ", e.message)
    }
})
locationsSchema.post("save", async function(doc) {
    try {
        const tables = await Tables.findOne({})
        tables.locations = doc.count
        await tables.save()
    } catch (e) {
        console.log("locations model post save: ", e.message)
    }
})

export default mongoose.models.Location || mongoose.model('Location', locationsSchema)