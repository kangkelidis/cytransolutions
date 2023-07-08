import Driver from "../../../models/driver";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const total = await Driver.count({});
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    filteredData.count = total + 1;
    await Driver.create(filteredData);
    return res.json({ message: "ok" });
  }

  if (req.method === "GET") {
    const id = req.query.id;

    if (id) {
      const result = await Driver.findById(id);
      return res.json({ body: result });
    }

    const result = await Driver.find({})

    return res.json({ body: { data: result } });
  }

  if (req.method === "PUT") {
    const id = req.query.id;
    const data = JSON.parse(req.body);
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    await Driver.findByIdAndUpdate(id, {
      name: filteredData.name,
      tel: filteredData.tel,
      email: filteredData.email,
      notes: filteredData.notes,
    });
    return res.json({ message: "ok" });
  }

  if (req.method === "DELETE") {
    const id = req.query.id;
    await Driver.findByIdAndDelete(id)
    return res.json({ message: "ok" });

  }
}
