import Driver from "../../../models/driver";
import dbConnect from "../../../utils/dbConnect";
import Tables from "../../../models/tables";
import tables from "../../../models/tables";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const total = await Driver.count({});
    let filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != "")
    );
    filteredData.count = total + 1;

    if (await Driver.create(filteredData)) {
      const tables = Tables.find({})
      Tables.findOneAndUpdate({}, {drivers: tables.drivers + 1})
    };
    return res.json({ message: "ok" });
  }

  if (req.method === "GET") {
    const perPage = req.query.limit;
    const page = req.query.page;
    const id = req.query.id;
    const query = req.query.query
    const sort = req.query.sort
    const rev = req.query.rev
    const name = req.query.name

    if (name) {
      const result = await Driver.findOne({name: name});
      return res.json({ body: {data: result} });
    }

    if (id) {
      const result = await Driver.findById(id);
      return res.json({ body: result });
    }

    if (query) {
      let mongooseQuery = Driver.find({name: new RegExp(`${query}.`, "ig")})
      try {
        
        mongooseQuery.find({count: parseInt(query)})
      } catch (error) {
        
      }

      const result = await mongooseQuery.exec()
      // .limit(perPage)
      // .skip(perPage * page);
      console.log("RES£" , result)
      return res.json({ body: result })
    }
    const total = await Driver.count({});
    const result = await Driver.find({})
      .limit(perPage)
      .skip(perPage * page).sort({ [sort]: rev === "false" ? 1 : -1});
      return res.json({ body: { data: result, total: total } });
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
      color: filteredData.color,
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
