import Client from "../../../models/client";
import dbConnect from "../../../utils/dbConnect";
import Tables from "../../../models/tables";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    // TODO:use a total created count. Stored in a table and update that
    // to avoid duplicated ids after delete 
    const tables = await Tables.findOne({})
    const count = tables.clients + 1
    data.code = count
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );

    try {
      const client = await Client.create(filteredData)
      if (client) {
        await Tables.findOneAndUpdate({}, {clients: count})
      }
      return res.json({ message: "ok" });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Error")
    }
  }

  if (req.method === "GET") {
    const perPage = req.query.limit;
    const page = req.query.page;
    const id = req.query.id;
    const sort = req.query.sort

    if (id) {
      const result = await Client.findById(id);
      return res.json({ body: result });
    }

    const total = await Client.count({});
    const result = await Client.find({})
      .sort({ [sort]: 1})
      .limit(perPage)
      .skip(perPage * page)
    return res.json({ body: { data: result, total: total } });
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    await Client.findByIdAndUpdate(id, {
      name: filteredData.name,
      address: filteredData.address,
      tel: filteredData.tel,
      notes: filteredData.notes,
      email: filteredData.email,
    });
    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    await Client.findByIdAndDelete(id)
    return res.json({ message: "ok" });

  }
}
