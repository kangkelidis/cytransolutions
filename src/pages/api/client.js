import Client from "../../../models/client";
import dbConnect from "../../../utils/dbConnect";

export default async function handler(req, res) {
    await dbConnect()

    if (req.method === "POST") {
        const data = JSON.parse(req.body)
        console.log(data);
        await Client.create(data)
        return res.json({message: "ok"})
    }

    if (req.method === "GET") {

        const result = await Client.find({})
    
        return res.json({body: result})
    }




}
