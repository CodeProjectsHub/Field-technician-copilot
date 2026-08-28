import { Annotation } from "@langchain/langgraph";
import type { Diagnosis } from "../schemas/diagnosis.js";
import type { TechnicianResponse } from "../schemas/technician-response.js";
// ==================================================
// TROUBLESHOOTING GRAPH STATE
// ==================================================
//
// This is the shared state passed between LangGraph nodes.
//
// Flow:
//
// technicianInput
//       ↓
// generatedPrompt
//       ↓
// diagnosis
//
// Later we will add:
//       ↓
// finalResponse
// ==================================================

export const TroubleshootingState = Annotation.Root({
  technicianInput: Annotation<string>,

  // Existing context from the current troubleshooting session.
  currentContext: Annotation<string>,

  generatedPrompt: Annotation<string>,

  diagnosis: Annotation<Diagnosis>,

  route: Annotation<"respond" | "clarify">,
  
  finalResponse: Annotation<string>,
});