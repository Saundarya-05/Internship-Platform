import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Internship from "@/models/Internship";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    const reviewerKey = request.headers.get("x-reviewer-key");
    if (!process.env.REVIEWER_KEY || reviewerKey !== process.env.REVIEWER_KEY) {
      return NextResponse.json({ message: "Reviewer access denied" }, { status: 401 });
    }
    const body = await request.json();
    if (!["Approved", "Rejected"].includes(body.reviewerStatus)) return NextResponse.json({ message: "Choose Approved or Rejected" }, { status: 400 });
    await connectDB();
    const updated = await Internship.findByIdAndUpdate(id, { reviewerStatus: body.reviewerStatus, reviewerNote: String(body.reviewerNote || "").slice(0, 500) }, { new: true });
    if (!updated) return NextResponse.json({ message: "Internship not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) { return NextResponse.json({ message: "Could not save review", error: error.message }, { status: 500 }); }
}
