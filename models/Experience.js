import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  outcome: { type: String, enum: ["Selected", "Completed", "Not selected", "Ongoing"], required: true },
  feedback: { type: String, required: true },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", default: null }
}, { timestamps: true });

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
