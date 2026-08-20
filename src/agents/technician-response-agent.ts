import { createAgent } from "langchain";
import { model } from "../models/ollama.js";

// ==================================================
// TECHNICIAN RESPONSE AGENT
// ==================================================
//
// Agent 3 receives the structured diagnosis from
// Agent 2 and converts it into a concise response
// for the field technician.
//
// Unlike Agent 2, this agent does NOT need structured
// output. Plain text is more reliable for our small
// local model and reduces structured-output failures.
//
// Agent 2:
//   "What is probably wrong?"
//
// Agent 3:
//   "What should the technician see?"
// ==================================================

export const technicianResponseAgent = createAgent({
  model,

  tools: [],

  systemPrompt: `
You are a Technician Response Agent.

Convert the provided diagnostic result into a concise,
practical response for a field technician.

Rules:

- Do not perform a new diagnosis.
- Use only the information provided.
- Preserve important warnings.
- Convert the diagnostic actions into clear steps.
- Keep the response concise.
- Do not invent equipment-specific information.
- If the diagnosis has low confidence, clearly state that.
- Return ONLY the technician-facing response.
`,
});