import Fastify from "fastify";
//import { createAgent } from "langchain";
//import { ChatOllama } from "@langchain/ollama";
//import { model } from "./models/ollama.js";
import { promptAgent } from "./agents/prompt-agent.js";
import { diagnosticAgent } from "./agents/diagnostic-agent.js";
// Uncomment when we are ready to enable tools.
// import { tool } from "langchain";
// import { z } from "zod";

const app = Fastify({
  logger: true,
});

// ==================================================
// 1. LOCAL LLM
// ==================================================

// const model = new ChatOllama({
//   model: "qwen3:1.7b",
//   temperature: 0.2,
//   numCtx: 4096,
//   think: false,
//   baseUrl: "http://127.0.0.1:11434",
// });

// ==================================================
// 2. ZOD SCHEMA + TOOL
// ==================================================
//
// Kept commented for now.
//
// When we start using tools, uncomment:
//
// import { tool } from "langchain";
// import { z } from "zod";
//
// --------------------------------------------------
//
// const TechnicianToolInput = z.object({
//   topic: z.string(),
// });
//
// const technicianReferenceTool = tool(
//   async ({ topic }) => {
//     return `Technician reference information for: ${topic}`;
//   },
//   {
//     name: "technician_reference",
//     description:
//       "Provides basic reference information relevant to a field technician.",
//     schema: TechnicianToolInput,
//   }
// );
//
// ==================================================


// ==================================================
// 3. PROMPT GENERATOR AGENT
// ==================================================

// const agent = createAgent({
//   model,

//   // Tools are intentionally disabled for now.
//   //
//   // When ready:
//   //
//   // tools: [technicianReferenceTool],

//   tools: [],

//   systemPrompt: `
// You are a Prompt Generator Agent.

// Your ONLY job is to convert the user's free-text request
// into a prompt that will be given to another AI agent.

// You are NOT the final answering agent.

// NEVER answer the user's original request.

// NEVER provide the actual solution, instructions,
// steps, explanation, or final answer to the user's task.

// Instead, understand the user's intent and create a
// clear prompt that instructs another AI agent to perform
// the requested task.

// The generated prompt should include, when relevant:

// - Role
//   What role the downstream AI should take.

// - Objective
//   What the downstream AI needs to accomplish.

// - Context
//   Important information provided by the user.

// - Instructions
//   How the downstream AI should approach the task.

// - Constraints
//   Important limitations or requirements.

// - Expected Output
//   What the downstream AI should return.

// Preserve important details from the user's request.

// Do not invent unnecessary requirements.

// If information is missing, make a reasonable assumption
// instead of asking the user unnecessary questions.

// Keep the generated prompt concise, practical, and
// specific enough for another AI agent to execute.

// Return ONLY the generated prompt.
// `,
// });


// ==================================================
// 4. HEALTH CHECK
// ==================================================

app.get("/health", async () => {
  return {
    status: "ok",
  };
});


// ==================================================
// 5. PROMPT GENERATOR API
// ==================================================

app.post<{
  Body: {
    input: string;
  };
}>("/api/agent", async (request, reply) => {
  const { input } = request.body;

  // Basic validation
  if (!input || typeof input !== "string") {
    return reply.status(400).send({
      error: "input must be a non-empty string",
    });
  }

  try {
    const start = Date.now();

    // ----------------------------------------------
    // Run Prompt Generator Agent
    // ----------------------------------------------

    const result = await promptAgent.invoke({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });
   
    // ----------------------------------------------
    // Get final agent response
    // ----------------------------------------------

    const lastMessage =
      result.messages[result.messages.length - 1];

     //testing diagnose agent
    const generatedPrompt = lastMessage.content;
    const diagnosisResult = await diagnosticAgent.invoke({
      messages: [
        {
          role: "user",
          content: generatedPrompt,
        },
      ],
    });
    const elapsedMs = Date.now() - start;

    return {
      prompt: generatedPrompt,
      diagnosis: diagnosisResult.structuredResponse,
      elapsedMs,
    };

  } catch (error) {
    request.log.error(error);

    return reply.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
});


// ==================================================
// 6. START SERVER
// ==================================================

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    console.log(
      "API running on http://localhost:3000"
    );

  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();