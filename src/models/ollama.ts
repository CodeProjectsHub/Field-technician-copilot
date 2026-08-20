import { ChatOllama } from "@langchain/ollama";
export const model = new ChatOllama({
  model: "qwen3:1.7b",
  temperature: 0.2,
  numCtx: 4096,
  think: false,
  baseUrl: "http://127.0.0.1:11434",
});
