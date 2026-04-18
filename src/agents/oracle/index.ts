import type { AgentConfig } from "@opencode-ai/sdk";
export function createOracleAgent(model: string): AgentConfig {
  return { description: "Oracle - Consultation", mode: "subagent", model, prompt: "Provide expert advice on complex problems. Analyze requirements and suggest solutions. Read-only consultation." };
}
