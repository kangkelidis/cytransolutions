import Ride from "../../../models/ride";
import Driver from "../../../models/driver";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import Locations from "../../../models/locations";
import Invoices from "../../../models/invoices";
const invoiceApi = await import("../api/invoice");

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);

    if (belongsInAnInvoice(data)) {
      data.invoice = await generateInvoiceId(data);
    }

    try {
      const ride = await Ride.create(data);
      if (ride) {
        if (belongsInAnInvoice(data)) {
          await invoiceApi.addRideId(
            ride.invoice,
            new mongoose.Types.ObjectId(ride._id)
          );
          await invoiceApi.findTotal(ride.invoice);
        }
      }
      return res.json({ message: "ok" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("Error");
    }
  }

  if (req.method === "GET") {
    const perPage = req.query.limit;
    const page = req.query.page;
    const id = req.query.id;
    const sort = req.query.sort;
    const rev = req.query.rev;

    const from = req.query.from
    const till = req.query.till
    const client = req.query.client
    const cash = req.query.cash
    const credit = req.query.credit
    const invoice = req.query.invoice

    const term = req.query.term

    const locations = req.query.locations

    const filters = {
      from: from ? new Date(from) : undefined,
      till: till ? new Date(till) : undefined,
      client: client,
      cash: cash === "true" ? 1 : cash === "false" ? 0 : undefined,
      credit: credit === "true" ? 1 : credit === "false" ? 0 : undefined,
      invoice: invoice
    }

    try {

      if (locations) {
        const result =  await Locations.find({})
        return res.json({ body: result });
      }

      if (id) {
        const result = await Ride.findById(id)
          .populate("client")
          .populate("driver")
          .populate("invoice");
        return res.json({ body: result });
      }

      const total = await Ride.countDocuments({});
      let result;
      if (perPage && page) {
        console.log("api get term ", term);
        if (term !== "undefined") {
          let allResults = await Ride.find({})
          .populate("client")
          .populate("driver")
          .populate("invoice");
          let pattern = new RegExp(`\w*${term}\w*`, "gi");
          let filteredResults = new Set()
          allResults.forEach(res => {
            if (res.client && pattern.test(res.client.name)) filteredResults.add(res)
            if (res.driver && pattern.test(res.driver.name)) filteredResults.add(res)
            if (pattern.test(res.passenger)) filteredResults.add(res)
            if (pattern.test(res.from)) filteredResults.add(res)
            if (pattern.test(res.to)) filteredResults.add(res)
            if (pattern.test(res.notes)) filteredResults.add(res)
            if (pattern.test(res.count)) filteredResults.add(res)
          });
          allResults = Array.from(filteredResults)

          const idsToFind = allResults.map(res => res._id)
          result = await Ride.find({ _id: {$in: idsToFind}})
          .limit(perPage)
          .skip(perPage * page)
          .sort({ [sort]: rev === "false" ? 1 : -1 })
          .populate("client")
          .populate("driver")
          .populate("invoice");

          if (!Array.isArray(result)) result = Array.from(result)
        } else {
          result = await Ride.findWithFilters(filters)
            .limit(perPage)
            .skip(perPage * page)
            .sort({ [sort]: rev === "false" ? 1 : -1 })
            .populate("client")
            .populate("driver")
            .populate("invoice");


            console.log("find with filters, ", filters);
        }

      } else {
        // RIDES IN INVOICE
        result = await Ride.find({})
          .populate("client")
          .populate("driver")
          .populate("invoice")
          .sort({ [sort]: rev === "false" ? 1 : -1 });
        return res.json({ body: { data: result } });
      }
      return res.json({ body: { data: result, total: total } });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error" });
    }
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    // use this to find if invoice changed
    const prevRide = await Ride.findById(id);

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
      await invoiceApi.findTotal(ride.invoice);
    }

    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    const ride = await Ride.findByIdAndDelete(id);
    if (ride.invoice) {
      const inv = await Invoices.findById(ride.invoice)
      inv.rides = inv.rides.filter((invRide) => {
        return ride._id.toString() !== invRide.toString()})
      await invoiceApi.findTotal(ride.invoice);
      await inv.save();
  }
    
    return res.json({ message: "ok" });
  }
}

function belongsInAnInvoice(data) {
  // if credit amount and known client
  return data.credit && data.client;
}

async function generateInvoiceId(data) {
  const client_id = new mongoose.Types.ObjectId(data.client._id);
  // logic to find or create the invoice the ride belongs to
  const openInvoice = await invoiceApi.findOpenInvoice(client_id);

  let invoice_id;
  if (openInvoice) {
    invoice_id = openInvoice._id;
  } else {
    // create a new Invoice
    invoice_id = await invoiceApi.createNewInvoice(data.client);
  }

  return invoice_id;
}

