import Invoice from "../../../models/invoices";
import dbConnect from "../../../utils/dbConnect";
import Client from "../../../models/client";
import Ride from "../../../models/ride";
import { zeroPad } from "../../../utils/utils";
import Tables from "../../../models/tables"; 

export default async function handler(req, res) {
  await dbConnect();
  
  if (req.method === "POST") {
    const data = req.body;
    // Only allow creation of a custom invoice if data.custom is true.
    if (data.custom) {
      try {
        //  increase the table counting custom invoices
        const tables = await Tables.findOne({})
        const count = tables.custom_invoices + 1
        await Tables.findOneAndUpdate({}, {custom_invoices: count})
        return res.status(200).json({ message: "Custom invoice created" });
      } catch (error) {
        console.log("Custom invoice creation error: ", error.message);
        return res.status(500).json({ message: error.message });
      }
    } else {
      // Optionally, for non-custom posts, you could return an error or delegate to other logic.
      return res.status(400).json({ message: "POST only supports custom invoices" });
    }
  }

  if (req.method === "GET" && req.query.nextCustom === "true") {
    try {
      const tables = await Tables.findOne({})
      const countCustom = tables.custom_invoices
      const nextCode = `${countCustom + 1}`;
      return res.status(200).json({ nextCode });
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
          .populate({path: 'rides', options: { sort: { 'date': 1 } } });
        return res.json({ body: { data: result } });
      }

      let query = Invoice.find({});
      if (filters.from !== undefined) query.find({ date: { $gte: filters.from } });
      if (filters.till !== undefined) query.find({ date: { $lte: filters.till } });

      let result = await query
        .populate("client")
        .populate({path: 'rides', options: { sort: { 'date': -1 } } })
        .sort({ [sort]: rev === "false" ? 1 : -1 });

      if (filters.inv_status !== "" && filters.inv_status !== undefined) {
        result = result.filter((res) => {
          return (filters.inv_status.indexOf(res.status) != -1);
        });}

      // SEARCH TERM
      if (term !== "undefined" && term != "") {
        result = await searchUsingTerm(term, sort, rev, result);
      }

      const total = result.length;
      result = result.slice(perPage * page, perPage * page + perPage);
      return res.json({ body: { data: result, total: total } });
    } catch (e) {
      console.log("ERROR INVOICE API GET", e.message);
      return res.status(500).json({ message: "error" });
    }
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    console.log(data);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    await Invoice.findByIdAndUpdate(id, {
      date: filteredData.date,
      status: filteredData.status,
      notes: filteredData.notes,
      vat_included: Boolean(filteredData.vat_included)
    });
    return res.json({ message: "ok" });
  }

}

export async function findOpenInvoice(client_id) {
  console.log("searching for open invoice with client id: ", client_id);
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


async function searchUsingTerm(term, sort, rev, allResults) {
  console.log("SEARCH USING TERMS");
  let pattern = new RegExp(`\w*${term}\w*`, "gi");
  let filteredResults = new Set();
  allResults.forEach((res) => {
    console.log(res.code, term);
    if (pattern.test(res.code)) filteredResults.add(res);
    if (pattern.test(res.client?.name)) filteredResults.add(res);
    if (pattern.test(res.status)) filteredResults.add(res);
    if (res.date && pattern.test(res.date)) filteredResults.add(res);
    if (pattern.test(res.notes)) filteredResults.add(res);
  });
  allResults = Array.from(filteredResults);

  const idsToFind = allResults.map((res) => res._id);
  let result = await Invoice.find({ _id: { $in: idsToFind } })
    .sort({ [sort]: rev === "false" ? 1 : -1 })
    .populate("client")
    .populate("rides")

  if (!Array.isArray(result)) result = Array.from(result);

  return result
}



