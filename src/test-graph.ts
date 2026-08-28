import { troubleshootingGraph } from "./graph/troubleshooting-graph.js";

// ==================================================
// LANGGRAPH TEST
// ==================================================
//
// Raw technician input
//       +
// Current context
//       ↓
// Prompt Agent
//       ↓
// Diagnostic Agent
//       ↓
// Technician Response Agent
//       ↓
// Final Response + Generated Context
// ==================================================

const technicianInput =
  "Customer has no internet connection. " +
  "The router has power but the WAN light is red. " +
  "Please troubleshoot the issue step by step.";

//const technicianInput = "Why?";

// First interaction has no previous context.
const currentContext = "";

console.log("Starting LangGraph...\n");

const start = Date.now();

const result = await troubleshootingGraph.invoke({
technicianInput,
currentContext,
});

const elapsed = ((Date.now() - start) / 1000).toFixed(2);

console.log(`Completed in ${elapsed}s\n`);

console.log("========== GENERATED PROMPT ==========\n");
console.log(result.generatedPrompt);

console.log("\n========== DIAGNOSIS ==========\n");
console.log(
JSON.stringify(result.diagnosis, null, 2)
);

console.log("\n========== TECHNICIAN RESPONSE ==========\n");
console.log(result.finalResponse);

console.log("\n========== GENERATED CONTEXT ==========\n");
console.log(result.currentContext);

console.log("\n=========================================\n");
