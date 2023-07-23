import mongoose from "mongoose";
import Locations from "./locations";
import Tables from "./tables";
import Invoices from "./invoices";
import Client from "./client";

const rideSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
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
      required: false,
    },
    notes: {
      type: String,
    },
    cash: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoices",
    },
    count: {
      type: Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

rideSchema.post("validate", async function (doc) {
  console.log("RIDE MODEL: POST VALIDATION ", doc);
  console.log("prev invoice", doc.prev_inv);
  doc.total = doc.credit + doc.cash;

  // only when creating new ride
  if (!doc.count) {
    const tables = await Tables.findOne({});
    tables.rides += 1;
    await tables.save();
    doc.count = tables.rides;

    if (doc.invoice) {
      const inv = await Invoices.findById(this.invoice);
      await inv.addRide(doc._id);
    }
  } else {

      // existing ride updated
      if (doc.prev_inv && !doc.invoice) {
        console.log("was in an invoice but does not belong to an invoice anymore");
        removeRideFrom(doc.prev_inv, this._id)
        doc.invoice = undefined;
      }
    
      if (doc.prev_inv && doc.invoice && doc.prev_inv.toString() !== doc.invoice.toString()) {
        console.log("was in an invoice but changed clients");
        removeRideFrom(doc.prev_inv, this._id)
        const inv = await Invoices.findById(doc.invoice);
        inv.addRide(doc._id)
      }
    
      if (!doc.prev_inv && doc.invoice) {
        console.log("was not in an invoice but now is");
        const inv = await Invoices.findById(doc.invoice);
        inv.addRide(doc._id)
      }
  }
});

rideSchema.pre("save", async function (next) {
  console.log("RIDE MODEL: PRE SAVE", this);

  next();
});

rideSchema.post("save", async function (doc) {
  console.log("RIDE MODEL: POST SAVE", doc);
  try {
    if (doc.invoice) {
      const inv = await Invoices.findById(doc.invoice);
      await inv.calculateTotal();
    }

    await Locations.create({ name: doc.from });
    if (doc.to && doc.from != doc.to) {
      await Locations.create({ name: doc.to });
    }
  } catch (e) {
    console.log("ride model post save: ", e.message);
  }
});

rideSchema.post("findByIdAndDelete", async function (doc) {
  if (doc.invoice) {
    const inv = await Invoices.findById(doc.invoice);
    inv.rides.filter((ride) => {
      console.log(ride);
      console.log(doc._id);
      return ride !== doc._id;
    });
    inv.calculateTotal();
    await inv.save();
  }
  console.log("%s has been removed", doc._id);
});

rideSchema.statics.findWithFilters = async function (filters) {
  let query = this.find({});
  if (filters.from !== undefined) query.find({ date: { $gte: filters.from } });
  if (filters.till !== undefined) query.find({ date: { $lte: filters.till } });
  if (filters.client !== undefined)
    query.find().exists("client", filters.client);
  if (filters.cash !== undefined)
    filters.cash > 0
      ? query.find({ cash: { $gte: filters.cash } })
      : query.find({ cash: 0 });
  if (filters.credit !== undefined)
    filters.credit > 0
      ? query.find({ credit: { $gte: filters.credit } })
      : query.find({ credit: 0 });
  if (filters.invoice !== undefined)
    query.find().exists("invoice", filters.invoice);

  return query;
};

async function removeRideFrom(inv_id, ride_id) {
    const inv = await Invoices.findById(inv_id);
    await inv.removeRide(ride_id);
    const total = await inv.calculateTotal();
    // Delete invoice if no rides left
    if (total === 0) {
      const client = await Client.findById(inv.client);
      client.invoicesCreated -= 1;
      await client.save();
      await Invoices.findByIdAndDelete(inv_id);
    }
}

export default mongoose.models.Ride || mongoose.model("Ride", rideSchema);
