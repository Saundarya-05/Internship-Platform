import mongoose from "mongoose";

const InternshipSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  stipend: { type: String, default: "Not disclosed" },
  location: { type: String, required: true },
  description: { type: String, required: true },
  applicationLink: { type: String, required: true },
  companyWebsite: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  registrationFee: { type: Boolean, default: false },
  riskScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ["Low Risk", "Medium Risk", "High Risk"], default: "Low Risk" },
  riskReasons: { type: [String], default: [] },
  reviewerStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reviewerNote: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.Internship || mongoose.model("Internship", InternshipSchema);
