import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Internship from "@/models/Internship";
import { internshipSchema } from "@/lib/validations";
import { assessRisk } from "@/lib/risk";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    await connectDB();
    const item = await Internship.findById(id);
    if (!item) return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (error) { return NextResponse.json({ message: "Could not fetch internship", error: error.message }, { status: 500 }); }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    const parsed = internshipSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please check the form", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    await connectDB();
    const updated = await Internship.findByIdAndUpdate(id, { ...parsed.data, ...assessRisk(parsed.data), reviewerStatus: "Pending", reviewerNote: "" }, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) { return NextResponse.json({ message: "Could not update internship", error: error.message }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    await connectDB();
    const deleted = await Internship.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Internship deleted" });
  } catch (error) { return NextResponse.json({ message: "Could not delete internship", error: error.message }, { status: 500 }); }
}
