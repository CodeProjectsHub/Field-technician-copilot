# AI Agent Platform

A multi-agent troubleshooting API designed to provide conversational assistance to field technicians.

The platform accepts a technician's natural-language troubleshooting request and processes it through a LangGraph-based workflow consisting of multiple specialized agents.

## Architecture

The current workflow is:

```text
Technician Application
        |
        | POST /api/agent
        v
   Fastify API
        |
        v
   LangGraph
   Orchestrator
        |
        v
+---------------------+
| Prompt Generator    |
| Agent 1             |
+----------+----------+
           |
           | Generated Diagnostic Prompt
           v
+---------------------+
| Diagnostic Agent    |
| Agent 2             |
| Structured Output   |
+----------+----------+
           |
           | Diagnosis + Confidence
           v
+---------------------+
| Decision Node       |
| Deterministic       |
+----------+----------+
           |
       +---+---+
       |       |
   respond   clarify
       |       |
       v       v
+----------+  +----------------+
| Response |  | Clarification  |
| Agent 3  |  | Node           |
+----+-----+  +-------+--------+
     |                |
     +-------+--------+
             |
             v
            END
             |
             v
        Fastify Response