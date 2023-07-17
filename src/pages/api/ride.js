import Ride from "../../../models/ride";
import Driver from "../../../models/driver";
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
    // let filteredData = Object.fromEntries(
    //   Object.entries(data).filter(([_, v]) => v != "")
    // );
    let filteredData = data
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
          await invoiceApi.addRideId(ride.invoice, new mongoose.Types.ObjectId(ride._id))
          await invoiceApi.findTotal(ride.invoice)
        }
      }
      return res.json({ message: "ok" });
      
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Error")
    }

  }










  if (req.method === "GET") {
    const perPage = req.query.limit;
    const page = req.query.page;
    const id = req.query.id;
    const sort = req.query.sort
    const rev = req.query.rev

    try {
    if (id) {
        const result = await Ride.findById(id)
        .populate("client").populate("driver").populate("invoice");
        return res.json({ body: result });
      }
      
      const total = await Ride.count({});
      let result
      if (perPage && page) {
        result = await Ride.find({})
        .limit(perPage).skip(perPage * page)      
        .sort({ [sort]: rev === "false" ? 1 : -1})
        .populate("client").populate("driver").populate("invoice");
      } else {
        // RIDES IN INVOICE
        result = await Ride.find({})
        .populate("client").populate("driver").populate("invoice")        
        .sort({ [sort]: rev === "false" ? 1 : -1});
        return res.json({ body: { data: result } });
      }
      return res.json({ body: { data: result, total: total } });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Error"})
      }
    }
    
    





  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    // use this to find if invoice changed
    const prevRide = await Ride.findById(id)

    const ride = await Ride.findByIdAndUpdate(id, {
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

    if (ride.invoice) {
      await invoiceApi.findTotal(ride.invoice)
    }

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
    invoice_id = await invoiceApi.createNewInvoice(data.client)
  }

  return invoice_id
}

function filter() {
  
}
