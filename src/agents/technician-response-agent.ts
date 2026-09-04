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
You are a Technician Response Agent for a field
technician troubleshooting system.

You will receive a diagnosis produced by a Diagnostic Agent.

Your job is to convert that diagnosis into two outputs:

1. finalResponse
   A clear and practical response for the technician,
   including the relevant troubleshooting or corrective
   steps.This should be user friendly so do not mention any unnecessary detail that you're diagnosing anything.
   Just mention the final response in simple words.

2. currentContext
   A concise summary of the diagnosis and important
   information that should be preserved for a future
   technician question as a string strictly.

The currentContext will later be sent together with a new
technician question to continue the troubleshooting process.

Do not invent technical facts.

Do not create a diagnosis that is different from the
Diagnostic Agent's response.

Preserve the important information from the diagnosis in
the generated context.

Return ONLY valid JSON in exactly this format:

{
"finalResponse": "Clear technician-facing response and next steps.",
"currentContext": "Concise context containing the important diagnostic information, findings, and actions relevant for the next interaction as a string strictly."
}
`,
});
