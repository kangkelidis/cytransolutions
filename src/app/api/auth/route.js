import User from "../../../../models/user";
import dbConnect from "../../../../utils/dbConnect";
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req) {
  const data = await req.json();

  const { email, password } = data;

  dbConnect();

  console.log(data);

  const user = await User.create(data)

  return NextResponse.json({ message: 'Created user!' });
}
