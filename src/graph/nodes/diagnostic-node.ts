import { diagnosticAgent } from "../../agents/diagnostic-agent.js";
import { TroubleshootingState } from "../state.js";

// ==================================================
// DIAGNOSTIC AGENT NODE
// ==================================================
//
// This node takes the generated prompt from Agent 1
// and runs Agent 2.
//
// Input:
//   state.generatedPrompt
//
// Output:
//   state.diagnosis
// ==================================================

export async function diagnosticNode(
  state: typeof TroubleshootingState.State
) {
  const result = await diagnosticAgent.invoke({
    messages: [
      {
        role: "user",
        content: state.generatedPrompt,
      },
    ],
  });

  // Get the final message produced by Agent 2.
  const lastMessage =
    result.messages[result.messages.length - 1];

  // Agent 2 should return its structured diagnosis
  // as JSON text in the final AI message.
  if (typeof lastMessage.content !== "string") {
    throw new Error(
      "Diagnostic Agent returned non-text content"
    );
  }
  console.log(
    "RAW DIAGNOSTIC RESPONSE:",
    lastMessage.content
  );
  const diagnosis = JSON.parse(lastMessage.content);

  // Return only the state field this node is responsible for.
  return {
    diagnosis,
  };
}