import Ride from "../../../models/ride";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import Tables from "../../../models/tables";

const invoiceApi = await import("../api/invoice");


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const total = await Ride.count({});
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    filteredData.count = total + 1;

    if (belongsInAnInvoice(filteredData)) {
      filteredData.invoice = await generateInvoiceId(filteredData)
    }
    
    const ride = await Ride.create(filteredData)
    if (ride) {
      const tables = Tables.find({})
      Tables.findOneAndUpdate({}, {rides: tables.rides + 1})

      invoiceApi.addRideId(ride.invoice, new mongoose.Types.ObjectId(ride._id))
    }

    return res.json({ message: "ok" });
  }

  if (req.method === "GET") {
    const id = req.query.id;

    if (id) {
      const result = await Ride.findById(id);
      return res.json({ body: result });
    }

    const result = await Ride.find({})
    // add invoice code
    let results = await Promise.all(result.map(async res => {
      let invoice_code = await invoiceApi.getInvoiceCode(res.invoice)
      return {
        ...res._doc,
        invoice_code: invoice_code
      }
    }))
    return res.json({ body: { data: results } });
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    await Ride.findByIdAndUpdate(id, {
      date: filteredData.date,
      client: filteredData.client,
      driver: filteredData.driver,
      from: filteredData.from,
      to: filteredData.to,
      cash: filteredData.cash,
      credit: filteredData.credit,
      invoice: filteredData.invoice,
      notes: filteredData.notes,
    });
    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    await Ride.findByIdAndDelete(id)
    return res.json({ message: "ok" });

  }
}


function belongsInAnInvoice(data) {
// if credit amount and known client
 return data.credit && data.client;
}

async function generateInvoiceId(data) {
  const client_id = new mongoose.Types.ObjectId(data.client)
  // logic to find or create the invoice the ride belongs to
  const openInvoice = await invoiceApi.findOpenInvoice(client_id)
  
  let invoice_id;
  if(openInvoice) {
    invoice_id = openInvoice._id
  } else {
    // create a new Invoice
    invoice_id = await invoiceApi.createNewInvoice(data.client, data._id)
  }

  return invoice_id
}
