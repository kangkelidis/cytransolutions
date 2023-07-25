import User from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";
import mongoose from "mongoose";


export default async function handler(req, res) {
    await dbConnect();
  
    if (req.method === "POST") {
      const data = JSON.parse(req.body);
  
      console.log(data);
      try {
        const user = await User.create(data);
        return res.json({ message: "ok" });
      } catch (error) {
        console.log(error.message);
        return res.status(500).send("Error");
      }
    }
}

export async function getAllUsers() {
  await dbConnect()
  try {
    const res = await User.find({});
    return JSON.stringify(res);
  } catch (error) {
    console.log(error.message);
  }
}