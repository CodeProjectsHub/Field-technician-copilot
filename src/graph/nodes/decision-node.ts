import { TroubleshootingState } from "../state.js";

// ==================================================
// DECISION NODE
// ==================================================
//
// This is NOT an LLM.
//
// It is deterministic orchestration logic.
//
// Agent 2 produces:
//   diagnosis
//   confidence
//   actions
//   warnings
//
// This node decides what LangGraph should do next.
//
// high / medium confidence
//       ↓
//    respond
//       ↓
//   Agent 3
//
// low confidence
//       ↓
//    clarify
//       ↓
// clarification response
// ==================================================

export function decisionNode(state: typeof TroubleshootingState.State) {
  const confidence = state.diagnosis.confidence;

  if (confidence === "low") {
    return {
      route: "clarify" as const,
    };
  }

  return {
    route: "respond" as const,
  };
}
