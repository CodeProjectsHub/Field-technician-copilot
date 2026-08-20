import { technicianResponseAgent } from "../../agents/technician-response-agent.js";
import { TroubleshootingState } from "../state.js";

// ==================================================
// TECHNICIAN RESPONSE NODE
// ==================================================
//
// This node takes the structured diagnosis from Agent 2
// and converts it into the final technician-facing response.
//
// Input:
//   state.diagnosis
//
// Output:
//   state.finalResponse
// ==================================================

export async function technicianResponseNode(
  state: typeof TroubleshootingState.State
) {
  const result = await technicianResponseAgent.invoke({
    messages: [
      {
        role: "user",
        content: JSON.stringify(state.diagnosis),
      },
    ],
  });

  // Get the final message produced by Agent 3.
  const lastMessage =
    result.messages[result.messages.length - 1];

  if (typeof lastMessage.content !== "string") {
    throw new Error(
      "Technician Response Agent returned non-text content"
    );
  }
  // Agent 3 returns JSON text matching TechnicianResponseSchema.
  // Agent 3 returns plain text because it is a response
// formatter rather than a structured reasoning agent.
  const finalResponse = lastMessage.content;

  // Return only the state field this node owns.
  return {
    finalResponse,
  };
}