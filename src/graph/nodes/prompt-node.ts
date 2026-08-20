import { promptAgent } from "../../agents/prompt-agent.js";
import { TroubleshootingState } from "../state.js";

// ==================================================
// PROMPT GENERATOR NODE
// ==================================================
//
// This node takes the technician's raw input from the
// LangGraph state and runs Agent 1.
//
// Agent 1 produces a clean prompt for Agent 2.
//
// Input:
//   state.technicianInput
//
// Output:
//   state.generatedPrompt
// ==================================================

export async function promptNode(
  state: typeof TroubleshootingState.State
) {
  const result = await promptAgent.invoke({
    messages: [
      {
        role: "user",
        content: state.technicianInput,
      },
    ],
  });

  // Get the final message produced by Agent 1.
  const lastMessage =
    result.messages[result.messages.length - 1];

  // Agent 1 is expected to return text.
  if (typeof lastMessage.content !== "string") {
    throw new Error(
      "Prompt Agent returned non-text content"
    );
  }

  // Return only the state field this node is responsible for.
  return {
    generatedPrompt: lastMessage.content,
  };
}