import { NextRequest, NextResponse } from "next/server";
import Vitals from "@/models/Vitals";
import { dbConnect } from "@/lib/dbConnect";


export async function POST(req: NextRequest) {
  await dbConnect();
  const { userId, bp, sugar, weight, notes } = await req.json();
  try {
    const vitals = await Vitals.create({ userId, bp, sugar, weight, notes });
    return NextResponse.json(vitals);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save vitals" }, { status: 500 });
  }
}
