import Ride from "../../../models/ride";
import Driver from "../../../models/driver";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";
import Locations from "../../../models/locations";
import Invoices from "../../../models/invoices";
import Client from "../../../models/client";
const invoiceApi = await import("../api/invoice");

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    console.log("RIDE / POST - DATA: ", data);

    if (belongsInAnInvoice(data)) {
      // const client_id = new mongoose.Types.ObjectId(data.client._id);
      data.invoice = await generateInvoiceId(data.client);
    }

    try {
      const ride = await Ride.create(data);
      // if (ride) {
      //   if (belongsInAnInvoice(data)) {
      //     await invoiceApi.addRideId(
      //       ride.invoice,
      //       new mongoose.Types.ObjectId(ride._id)
      //     );
      //     await invoiceApi.findTotal(ride.invoice);
      //   }
      // }
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

    const from = req.query.from;
    const till = req.query.till;
    const client = req.query.client;
    const cash = req.query.cash;
    const credit = req.query.credit;
    const invoice = req.query.invoice;
    const inv_status = req.query.inv_status;
    const driver = req.query.driver;

    const term = req.query.term;

    const locations = req.query.locations;

    console.log("ride api query ", req.query);
    const filters = {
      from: from ? new Date(from) : undefined,
      till: till ? new Date(till) : undefined,
      client: client,
      cash: cash === "true" ? 1 : cash === "false" ? 0 : undefined,
      credit: credit === "true" ? 1 : credit === "false" ? 0 : undefined,
      invoice: invoice,
      inv_status: inv_status && inv_status.split("-"),
      driver: driver,
    };
    console.log("ride api filters ", filters);

    try {
      if (locations) {
        const result = await Locations.find({});
        return res.json({ body: result });
      }

      if (id) {
        const result = await Ride.findById(id)
          .populate("client")
          .populate("driver")
          .populate("invoice");
        return res.json({ body: result });
      }

      let total = await Ride.countDocuments({});
      let result;
      if (perPage && page) {
        console.log("api get term ", term);

        if (filters.invoice === "true" && inv_status) {
          result = await useFilter(filters, sort, rev);
          result = result.filter((res) => {
            return (
              filters.inv_status.indexOf(res.invoice.status) != -1 &&
              (filters.driver === "" || res.driver.name === filters.driver)
            );
          });

          result.sort((a, b) => {
            if (a.invoice.status < b.invoice.status) {
              return -1;
            } else if (a.invoice.status > b.invoice.status) {
              return 1;
            } else {
              return 0;
            }
          });
        } else {
          result = await useFilter(filters, sort, rev);
        }

        if (term !== "undefined" && term != "") {
          result = await searchUsingTerm(term, sort, rev, result);
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

      result = result.filter((res) => {
        return filters.driver === "" || res.driver.name === filters.driver;
      });

      total = result.length;
      result = result.slice(perPage * page, perPage * page + perPage);
      return res.json({ body: { data: result, total: total } });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Error" });
    }
  }

  // TODO use save
  if (req.method === "PUT") {
    console.log("RIDE PUT-----------");
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    // use this to find if invoice changed
    const ride = await Ride.findById(id);
    const prev_inv = ride.invoice

    ride.date = filteredData.date
    ride.client = filteredData.client
    ride.driver = filteredData.driver
    ride.passenger = filteredData.passenger
    ride.from = filteredData.from
    ride.to = filteredData.to
    ride.cash = filteredData.cash
    ride.credit = filteredData.credit
    ride.notes = filteredData.notes
    ride.prev_inv = prev_inv

    if (belongsInAnInvoice(filteredData)) {
      // either find invoice id or create a new
      ride.invoice = await generateInvoiceId(data.client);
    } else {
      // remove current invoice
      ride.invoice = null
    }

    await ride.save()

    return res.json({ message: "ok" });
  }


  if (req.method === "DELETE") {
    const id = req.query.id;
    const ride = await Ride.findByIdAndDelete(id);
    if (ride.invoice) {
      const inv = await Invoices.findById(ride.invoice);
      await inv.removeRide(ride._id)
      const total = await inv.calculateTotal()
      if (total === 0) {
        const client = await Client.findById(inv.client);
        client.invoicesCreated -= 1;
        await client.save();
        await Invoices.findByIdAndDelete(inv._id)
      }
    }
    
    return res.json({ message: "ok" });
  }
}

function belongsInAnInvoice(data) {
  // if credit amount and known client
  console.log("check if belongs in invoice ");
  return (data.credit && data.credit !== "0") && data.client;
}

async function generateInvoiceId(client) {
  // logic to find or create the invoice the ride belongs to
  const openInvoice = await invoiceApi.findOpenInvoice(client);

  let invoice_id;
  if (openInvoice) {
    invoice_id = openInvoice._id;
  } else {
    // create a new Invoice
    invoice_id = await invoiceApi.createNewInvoice(client);
  }

  return invoice_id;
}

async function searchUsingTerm(term, sort, rev, allResults) {
  let pattern = new RegExp(`\w*${term}\w*`, "gi");
  let filteredResults = new Set();
  allResults.forEach((res) => {
    if (res.client && pattern.test(res.client.name)) filteredResults.add(res);
    if (res.driver && pattern.test(res.driver.name)) filteredResults.add(res);
    if (pattern.test(res.passenger)) filteredResults.add(res);
    if (pattern.test(res.from)) filteredResults.add(res);
    if (pattern.test(res.to)) filteredResults.add(res);
    if (pattern.test(res.notes)) filteredResults.add(res);
    if (pattern.test(res.count)) filteredResults.add(res);
    if (pattern.test(res.date.toLocaleDateString())) filteredResults.add(res);
  });
  allResults = Array.from(filteredResults);

  const idsToFind = allResults.map((res) => res._id);
  let result = await Ride.find({ _id: { $in: idsToFind } })
    .sort({ [sort]: rev === "false" ? 1 : -1 })
    .populate("client")
    .populate("driver")
    .populate("invoice");

  if (!Array.isArray(result)) result = Array.from(result);
  return result;
}

async function useFilter(filters, sort, rev) {
  console.log(sort);
  let query = Ride.find({});
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

  return query
    .populate("client")
    .populate("driver")
    .populate("invoice")
    .sort({ [sort]: rev === "false" ? 1 : -1, "invoice.status": 1 })
    .exec();
}
