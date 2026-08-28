import { technicianResponseAgent } from "../../agents/technician-response-agent.js";

import { TroubleshootingState } from "../state.js";

// ==================================================
// TECHNICIAN RESPONSE NODE
// ==================================================
//
// This node takes the diagnosis from Agent 2.
//
// Agent 3 generates:
//
// - A final response for the technician.
// - Context that can be used in the next interaction.
//
// Input:
//
//   state.diagnosis
//
// Output:
//
//   state.finalResponse
//   state.currentContext
// ==================================================

export async function technicianResponseNode(
state: typeof TroubleshootingState.State
) {
const result = await technicianResponseAgent.invoke({
messages: [
{
role: "user",
content: JSON.stringify(state.diagnosis, null, 2),
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

// Agent 3 should return JSON containing:
//
// {
//   "finalResponse": "...",
//   "currentContext": "..."
// }

let response;

try {
response = JSON.parse(lastMessage.content);
} catch {
throw new Error(
"Technician Response Agent returned invalid JSON"
);
}
console.log('technician reponse agent responsee ' + lastMessage.content);
if (
typeof response.finalResponse !== "string" ||
typeof response.currentContext !== "string"
) {
throw new Error(
"Technician Response Agent response is missing required fields"
);
}

return {
finalResponse: response.finalResponse,
currentContext: response.currentContext,
};
}
