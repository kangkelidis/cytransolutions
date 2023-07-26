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

    const driverId = req.query.driverId;
    const clientId = req.query.clientId;

    const term = req.query.term;

    const locations = req.query.locations;

    console.log("ride api query ", req.query);

    // dashboard
    if (driverId) {
      let tillDate = till ? new Date(till) : undefined
      if (tillDate) {
        tillDate.setDate(tillDate.getDate() +1)
      }
      const filters = {
        from: from ? new Date(from) : undefined,
        till: tillDate,
        driverId: driverId,
        clientId: clientId,
      };

      filters.from.setHours(0,0,0,0)

      const result = await useFilter(filters, "date", "false");
      const count = result.length;
      const total = result.reduce((acc, ride) => {
        return acc + ride.total
      }, 0)
      const credit = result.reduce((acc, ride) => {
        return acc + ride.credit
      }, 0)

      return res.json({ body: { data: result, total: total, count: count, credit: credit } });
    }

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
        console.log("res", result);

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
          console.log("INVOICE RIDES API GET", result);
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
    console.log("RIDE", ride);
    const prev_inv = ride.invoice;

    console.log("Filter data", filteredData);
    if (filteredData.date) ride.date = filteredData.date;
    if (filteredData.client) ride.client = filteredData.client;
    if (filteredData.driver) ride.driver = filteredData.driver;
    if (filteredData.passenger) ride.passenger = filteredData.passenger;
    if (filteredData.from) ride.from = filteredData.from;
    if (filteredData.to) ride.to = filteredData.to;
    if (filteredData.cash) ride.cash = filteredData.cash;
    if (filteredData.credit) ride.credit = filteredData.credit;
    if (filteredData.notes) ride.notes = filteredData.notes;
    if (filteredData.duration) ride.duration = filteredData.duration;
    ride.prev_inv = prev_inv;
    console.log("RIDE2", ride);

    if (belongsInAnInvoice(ride)) {
      // either find invoice id or create a new
      ride.invoice = await generateInvoiceId(ride.client);
    } else {
      // remove current invoice
      ride.invoice = undefined;
    }

    await ride.save();

    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    const ride = await Ride.findByIdAndDelete(id);
    if (ride.invoice) {
      const inv = await Invoices.findById(ride.invoice);
      await inv.removeRide(ride._id);
      const total = await inv.calculateTotal();
      if (total === 0) {
        const client = await Client.findById(inv.client);
        client.invoicesCreated -= 1;
        await client.save();
        await Invoices.findByIdAndDelete(inv._id);
      }
    }

    return res.json({ message: "ok" });
  }
}

function belongsInAnInvoice(data) {
  // if credit amount and known client
  console.log("check if belongs in invoice ");
  return data.credit && data.credit !== "0" && data.client;
}

async function generateInvoiceId(client) {
  // logic to find or create the invoice the ride belongs to
  const openInvoice = await invoiceApi.findOpenInvoice(client);

  let invoice_id;
  if (openInvoice) {
    invoice_id = openInvoice._id;
  } else {
    // create a new Invoice
    console.log("Creating new invoice...");
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

  if (filters.driverId && filters.driverId !== "undefined") query.find({ driver: filters.driverId });
  if (filters.clientId && filters.clientId !== "undefined") query.find({ client: filters.clientId });

  return query
    .populate("client")
    .populate("driver")
    .populate("invoice")
    .sort({ [sort]: rev === "false" ? 1 : -1, "invoice.status": 1 })
    .exec();
}

export async function getTodaysRidesInfo(dateToDisplay, driverId, clientId) {
  await dbConnect();

  console.log("datetodisplay", dateToDisplay);
  const today = dateToDisplay ? new Date(dateToDisplay) : new Date()
  console.log("today1", today);
  today.setUTCHours(0,0,0,0)
  console.log("today2", today);
  const tomorrow = new Date(today)
  // tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setUTCHours(23,59,59,999)
  console.log("tomorrow", tomorrow);
  const filters = {
    from: today,
    till: tomorrow,
    driverId: driverId,
    clientId: clientId,
  };

  const result = await Ride.find({ $and: [
    {date: { $gte: filters.from }},
    {date: { $lte: filters.till }},
  ]})
  .populate("client")
  .populate("driver")
  .populate("invoice")
  return JSON.stringify( result );

}
