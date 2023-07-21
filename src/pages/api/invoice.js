import Invoice from "../../../models/invoices";
import dbConnect from "../../../utils/dbConnect";
import Client from "../../../models/client";
import Ride from "../../../models/ride";
import { zeroPad } from "../../../utils/utils";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const perPage = req.query.limit;
    const page = req.query.page;
    const id = req.query.id;

    const sort = req.query.sort;
    const rev = req.query.rev;

    const from = req.query.from;
    const till = req.query.till;
    const inv_status = req.query.inv_status;

    const term = req.query.term;

    console.log("GET INVOICE QUERY: ", req.query);

    const filters = {
      from: from ? new Date(from) : undefined,
      till: till ? new Date(till) : undefined,
      inv_status: inv_status && inv_status.split("-"),
    };
    console.log("invoice api filters ", filters);

    try {
      if (id) {
        const result = await Invoice.findById(id)
          .populate("client")
          .populate("rides");
        return res.json({ body: { data: result } });
      }

      let query = Invoice.find({});
      if (filters.from !== undefined)
        query.find({ date: { $gte: filters.from } });
      if (filters.till !== undefined)
        query.find({ date: { $lte: filters.till } });

      let result = await query
        .populate("client")
        .populate("rides")
        .sort({ [sort]: rev === "false" ? 1 : -1 });

        if (filters.inv_status[0] !== "") {
          result = result.filter((res) => {
            return (filters.inv_status.indexOf(res.status) != -1);
          });

        }
      const total = result.length;

      result = result.slice(perPage * page, perPage * page + perPage);

      // const total = await Invoice.countDocuments({});
      // let invoices = await Invoice.find({})
      //   .limit(perPage).skip(perPage * page)
      //   .populate("client");
      return res.json({ body: { data: result, total: total } });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: "error" });
    }
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
    await Invoice.findByIdAndDelete(id);
    return res.json({ message: "ok" });
  }
}

export async function findOpenInvoice(client_id) {
  const result = await Invoice.findOne({ client: client_id, status: "open" });
  return result;
}

export async function createNewInvoice(client_id) {
  const client = await Client.findById(client_id);
  const total = client.invoicesCreated + 1;
  const code = `${zeroPad(client.code, 3)}/${total}`;

  try {
    const result = await Promise.resolve(
      Invoice.create({ client: client_id, code: code })
    );
    await Client.findByIdAndUpdate(client_id, {
      invoicesCreated: total,
    });
    return result._id;
  } catch (error) {
    console.log(error);
  }
}

async function findClient(client_id) {
  let client;
  try {
    client = await Client.findById(client_id);
    return client;
  } catch (error) {
    console.log(error);
  }
}

export async function addRideId(inv_id, ride_id) {
  const invoice = await Invoice.findById(inv_id);
  invoice.rides.push(ride_id);
  await Invoice.findByIdAndUpdate(inv_id, { rides: invoice.rides });
}

// to be called when a new ride is inserted and when updated and deleted
export async function findTotal(inv_id) {
  const invoice = await Invoice.findById(inv_id);
  let total = 0;
  await Promise.all(
    invoice.rides.map(async (ride_id) => {
      const ride = await Ride.findById(ride_id);
      if (ride) total += ride.credit;
    })
  );

  await Invoice.findByIdAndUpdate(inv_id, { total: total });
}

export async function getInvoiceCode(inv_id) {
  // does not belong to an invoice
  if (!inv_id) return "";
  try {
    const invoice = await Invoice.findById(inv_id);
    return invoice.code;
  } catch (error) {
    console.log(error);
    console.log("Error inv_id ", inv_id);
  }
}
