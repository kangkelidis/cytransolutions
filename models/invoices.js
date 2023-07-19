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

invoicesSchema.pre('find', function(next) {
    if (this.rides) {
        this.total = this.rides.reduce((acc, ride) => {return acc + ride.credit}, 0)
    }

    console.log('Middleware on parent document'); // Will be executed
    next()
});

invoicesSchema.methods.calculateTotal = function() {
    if (this.rides) {
        this.total = this.rides.reduce((acc, ride) => {return acc + ride.credit}, 0)
    }}

invoicesSchema.post('validate', function(doc) {
    if (this.rides) {
        this.total = this.rides.reduce((acc, ride) => {return acc + ride.credit}, 0)
    } 
    console.log('%s has been validated (but not saved yet)', doc._id);
  });

export default mongoose.models.Invoices || mongoose.model('Invoices', invoicesSchema)
