import mongoose from "mongoose";
import Locations from "./locations";
import Tables from "./tables";
import Invoices from "./invoices"

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

rideSchema.post("validate", async function(doc) {
    doc.total = doc.credit + doc.cash

    const tables = await Tables.findOne({})
    tables.rides += 1
    await tables.save()
    doc.count = tables.rides
    
})

rideSchema.post("save", async function(doc) {
    try {
        if (doc.invoice) {
            const inv = await Invoices.findById(doc.invoice)
            inv.calculateTotal()
        }

        await Locations.create({name: doc.from})
        if (doc.to && doc.from != doc.to) {
            await Locations.create({name: doc.to})
        }


    } catch(e) {
        console.log("ride model post save: ", e.message);
    }
})



rideSchema.post('findByIdAndDelete', async function(doc) {
    if (doc.invoice) {
        const inv = await Invoices.findById(doc.invoice)
        inv.rides.filter((ride) => {
            console.log(ride);
            console.log(doc._id);
            return ride !== doc._id})
        inv.calculateTotal()
        await inv.save();
    }
    console.log('%s has been removed', doc._id);
  });


rideSchema.statics.findWithFilters = function(filters) {
    let query =  this.find({})    
    if (filters.from !== undefined) query.find({"date": { $gte: filters.from }})
    if (filters.till !== undefined) query.find({"date": {$lte: filters.till}})
    if (filters.client !== undefined) query.find().exists('client', filters.client)
    if (filters.cash !== undefined) filters.cash > 0 ? query.find({"cash": {$gt: filters.cash}}) : query.find({"cash": 0})
    if (filters.credit !== undefined) filters.credit > 0 ? query.find({"credit": {$gt: filters.credit}}) : query.find({"credit": 0})
    if (filters.invoice !== undefined) query.find().exists('invoice', filters.invoice)

    return query

}

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema)