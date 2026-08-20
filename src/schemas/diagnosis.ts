import { z } from "zod";

export const DiagnosisSchema = z.object({
  diagnosis: z.string(),

  confidence: z.enum([
    "high",
    "medium",
    "low",
  ]),

  actions: z.array(z.string()),

  warnings: z.array(z.string()),
});

export type Diagnosis = z.infer<typeof DiagnosisSchema>;