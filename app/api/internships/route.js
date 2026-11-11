import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Internship from "@/models/Internship";
import { internshipSchema } from "@/lib/validations";
import { assessRisk } from "@/lib/risk";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const filter = search ? { $or: [{ companyName: { $regex: search, $options: "i" } }, { role: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }] } : {};
    const internships = await Internship.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: internships });
  } catch (error) { return NextResponse.json({ success: false, message: "Could not fetch internships", error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = internshipSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, message: "Please check the form", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    await connectDB();
    const risk = assessRisk(parsed.data);
    const internship = await Internship.create({ ...parsed.data, ...risk });
    return NextResponse.json({ success: true, data: internship }, { status: 201 });
  } catch (error) { return NextResponse.json({ success: false, message: "Could not create internship", error: error.message }, { status: 500 }); }
}
