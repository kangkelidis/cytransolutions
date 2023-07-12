import Ride from "../../../models/ride";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import Tables from "../../../models/tables";

const invoiceApi = await import("../api/invoice");


export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const tables = await Tables.findOne({})
    const count = tables.rides + 1
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    filteredData.count = count;

    if (belongsInAnInvoice(filteredData)) {
      filteredData.invoice = await generateInvoiceId(filteredData)
    }
    
    try {
      const ride = await Ride.create(filteredData)
      if (ride) {
        const tables = await Tables.findOne({})
        const rides_num = tables.rides + 1
        await Tables.findOneAndUpdate({}, {rides: rides_num})
        if (belongsInAnInvoice(filteredData)) {
          invoiceApi.addRideId(ride.invoice, new mongoose.Types.ObjectId(ride._id))
        }
      }
      return res.json({ message: "ok" });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error")
    }

  }

  if (req.method === "GET") {
    const id = req.query.id;

    // TODO: not working, id is null and still runs
    if (id) {
      try {
        const result = await Ride.findById(id);
        return res.json({ body: result });
        
      } catch (error) {
        console.log(error);
      }
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
