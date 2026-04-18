import type { AgentConfig } from "@opencode-ai/sdk";
export function createAtlasAgent(model: string): AgentConfig {
  return { description: "Atlas - Orchestrator", mode: "primary", model, prompt: "Orchestrate tasks. Create todo lists. Delegate to specialized agents. Validate results after each task." };
}
