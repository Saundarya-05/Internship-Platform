import { z } from "zod";

export const internshipSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required"),
  role: z.string().trim().min(2, "Role is required"),
  stipend: z
  .string()
  .trim()
  .regex(/^[0-9]+$/, "Stipend must contain numbers only"),
  location: z.string().trim().min(2, "Location is required"),
  description: z.string().trim().min(10, "Description must contain at least 10 characters"),
  applicationLink: z.string().url("Enter a valid application URL"),
  companyWebsite: z.union([z.string().url(), z.literal("")]).optional().default(""),
  contactEmail: z.union([z.string().email(), z.literal("")]).optional().default(""),
  registrationFee: z.boolean().optional().default(false)
});

export const experienceSchema = z.object({
  studentName: z.string().trim().min(2, "Name is required"),
  companyName: z.string().trim().min(2, "Company name is required"),
  role: z.string().trim().min(2, "Role is required"),
  rating: z.coerce.number().min(1).max(5),
  outcome: z.enum(["Selected", "Completed", "Not selected", "Ongoing"]),
  feedback: z.string().trim().min(10, "Please write at least 10 characters"),
  internshipId: z.string().optional().nullable()
});
