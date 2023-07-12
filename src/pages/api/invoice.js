import Invoice from "../../../models/invoices";
import dbConnect from "../../../utils/dbConnect";
import Tables from "../../../models/tables";
import Client from "../../../models/client";
import mongoose from "mongoose";
import Ride from "../../../models/ride";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const id = req.query.id;

    if (id) {
      const result = await Invoice.findById(id);
      return res.json({ body: result });
    }

    let invoices = await Invoice.find({})
    // add client model to result
    invoices = await Promise.all(invoices.map(async (invoice) => {
        let cli = await findClient(invoice.client)
        let inv = invoice._doc
        return {
            ...inv,
            client: cli
        }
    }))
    return res.json({ body: { data: invoices } });
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    await Invoice.findByIdAndUpdate(id, {
      date: filteredData.date,
      status: filteredData.status,
      notes: filteredData.notes,
    });
    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    await Invoice.findByIdAndDelete(id)
    return res.json({ message: "ok" });

  }
}

export async function findOpenInvoice(client_id) {
    const result = await Invoice.findOne({"client": client_id, "status": "open"})
    return result
}

export async function createNewInvoice(client_id) {
    const client = await Client.findById(client_id);
    const total = client.invoicesCreated
    const code = `${client.code} / ${total+1}`

    try {
      const result = await Promise.resolve(Invoice.create({client: client_id, code: code, }))

      return result._id
    } catch (error) {
      console.log(error);
    }
}

async function findClient(client_id) {
    let client;
    try {
        client = await Client.findById(client_id)
        return client
    } catch (error) {
        console.log(error);
    }
}

export async function addRideId(inv_id, ride_id) {
    const invoice = await Invoice.findById(inv_id)
    invoice.rides.push(ride_id)
    await Invoice.findByIdAndUpdate(inv_id, {rides: invoice.rides})
}

// to be called when a new ride is inserted and when updated and deleted
export async function findTotal(inv_id) {
    // TODO: need to refresh cache
    // TODO: have array of ride objects
    const invoice = await Invoice.findById(inv_id)
    let total = 0
    await Promise.all(invoice.rides.map(async ride_id => {
        const ride = await Ride.findById(ride_id)
        if (ride) total += ride.credit
    }))

    await Invoice.findByIdAndUpdate(inv_id, {total: total})
}

export async function getInvoiceCode(inv_id) {
  // does not belong to an invoice
  if (!inv_id) return ""
  try {
    const invoice = await Invoice.findById(inv_id)
    return invoice.code
    
  } catch (error) {
    console.log(error);
    console.log(inv_id);
  }
}

