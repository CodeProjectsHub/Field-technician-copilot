import { troubleshootingGraph } from "./graph/troubleshooting-graph.js";

// ==================================================
// LANGGRAPH TEST
// ==================================================
//
// Raw technician input
//       ↓
// Prompt Agent
//       ↓
// Diagnostic Agent
//       ↓
// Final graph state
// ==================================================

// const technicianInput =
//   "Customer has no internet connection. " +
//   "The router has power but the WAN light is red. " +
//   "Please troubleshoot the issue step by step.";
const technicianInput = "Why?"

console.log("Starting LangGraph...\n");

const start = Date.now();

const result = await troubleshootingGraph.invoke({
  technicianInput,
});

const elapsed = ((Date.now() - start) / 1000).toFixed(2);

console.log(`Completed in ${elapsed}s\n`);

console.log("========== GENERATED PROMPT ==========\n");
console.log(result.generatedPrompt);

console.log("\n========== DIAGNOSIS ==========\n");
console.log(
  JSON.stringify(result.diagnosis, null, 2)
);

console.log("\n======================================\n");

console.log("\n========== TECHNICIAN RESPONSE ==========\n");
console.log(
  JSON.stringify(result.finalResponse, null, 2)
);

console.log("\n=========================================\n");