import Ride from "../../../models/ride";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const total = await Ride.count({});
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    filteredData.count = total + 1;
    await Ride.create(filteredData);
    return res.json({ message: "ok" });
  }

  if (req.method === "GET") {
    const id = req.query.id;

    if (id) {
      const result = await Ride.findById(id);
      return res.json({ body: result });
    }

    const result = await Ride.find({})

    return res.json({ body: { data: result } });
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
