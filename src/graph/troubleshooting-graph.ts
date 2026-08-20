import {
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { TroubleshootingState } from "./state.js";
import { promptNode } from "./nodes/prompt-node.js";
import { diagnosticNode } from "./nodes/diagnostic-node.js";
import { technicianResponseNode } from "./nodes/technician-response-node.js";
import { decisionNode } from "./nodes/decision-node.js";
// ==================================================
// TROUBLESHOOTING GRAPH
// ==================================================
//
// Current workflow:
//
// START
//   ↓
// Prompt Generator Agent
//   ↓
// Diagnostic Agent
//   ↓
// END
//
// LangGraph manages the state between each node.
// ==================================================

const graph = new StateGraph(TroubleshootingState)

  // ----------------------------------------------
  // Register nodes
  // ----------------------------------------------

  .addNode("promptGenerator", promptNode)
  .addNode("diagnostic", diagnosticNode)
  .addNode("decision", decisionNode)
  .addNode("technicianResponse", technicianResponseNode)

  // ----------------------------------------------
  // Define workflow
  // ----------------------------------------------

  .addEdge(START, "promptGenerator")
  .addEdge("promptGenerator", "diagnostic")
  .addEdge("diagnostic", "decision")
  //.addEdge("technicianResponse", END);
  .addConditionalEdges(
    "decision",
    (state) => state.route,
    {
      respond: "technicianResponse",
      clarify: END,
    }
  )
// Compile the graph before executing it.
export const troubleshootingGraph = graph.compile();