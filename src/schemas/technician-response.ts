import { z } from "zod";

export const TechnicianResponseSchema = z.object({
  summary: z.string(),

  steps: z.array(z.string()),

  warnings: z.array(z.string()),
});

export type TechnicianResponse = z.infer<
  typeof TechnicianResponseSchema
>;