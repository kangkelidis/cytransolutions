import mongoose from "mongoose";
import Ride from "./ride";

const invoicesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "open",
      enum: {
        values: ["open", "closed", "issued", "paid"],
      },
    },
    rides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ride" }],
    total: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: true,
    },
    vat_included: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

invoicesSchema.post("find", async function (doc) {

  console.log("Middleware on Invoice Find"); // Will be executed
});

invoicesSchema.methods.calculateTotal = async function () {
    console.log("INVOICE MODEL: CALCULATE TOTAL, this: ", this);
  if (this.rides && this.rides.length > 0) {
    let total = 0;
    await Promise.all(this.rides.map(async (ride_id) => {
        const ride = await Ride.findById(ride_id);
        if (ride) {
          total += ride.inv_credit ? ride.inv_credit : ride.credit;
        }
          
      })
    );
    
    this.total = total
    await this.save()
  } else {
    console.log("must be deleted");
    return 0;
  }

};

invoicesSchema.methods.removeRide = async function(ride_id) {
    console.log("INVOICE MODEL: remove ride");

    this.rides = this.rides.filter((invRide) => {
        return ride_id.toString() !== invRide.toString();
      });

    await this.save()
}

invoicesSchema.methods.addRide = async function(ride_id) {
    console.log("INVOICE MODEL: add ride");
    // add only if not already in the list
    if (this.rides.indexOf(ride_id) === -1) {
        this.rides.push(ride_id);
        await this.save()
    }
}

invoicesSchema.post("validate", async function (doc) {

});

export default mongoose.models.Invoices ||
  mongoose.model("Invoices", invoicesSchema);
