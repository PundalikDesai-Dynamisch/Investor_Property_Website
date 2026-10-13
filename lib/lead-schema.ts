import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  mobile: z.string().trim().regex(/^(\+?91)?[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]).optional(),
  area: z.string().optional(),
  budget: z.string().optional(),
  config: z.string().optional(),
  message: z.string().max(600).optional(),
  consent: z.boolean().refine((v) => v === true, "Please accept to continue"),
  company: z.string().max(0).optional(),
});
export type Lead = z.infer<typeof leadSchema>;
