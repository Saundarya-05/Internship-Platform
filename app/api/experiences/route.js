import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Experience from "@/models/Experience";
import { experienceSchema } from "@/lib/validations";

export async function GET() {
  try {
    await connectDB();
    const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) { return NextResponse.json({ message: "Could not fetch experiences", error: error.message }, { status: 500 }); }
}



export async function POST(request) {
  try {
    const parsed = experienceSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please check the form",
          errors: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    await connectDB();

    const data = { ...parsed.data };

    if (!data.internshipId) {
      data.internshipId = null;
    } else if (!mongoose.isValidObjectId(data.internshipId)) {
      return NextResponse.json(
        { message: "Invalid internship ID" },
        { status: 400 }
      );
    }

    const experience = await Experience.create(data);

    return NextResponse.json(
      { success: true, data: experience },
      { status: 201 }
    );

  } catch (error) {
    console.error("Experience POST Error:", error);

    return NextResponse.json(
      {
        message: "Could not submit experience",
        error: error.message
      },
      { status: 500 }
    );
  }
}
