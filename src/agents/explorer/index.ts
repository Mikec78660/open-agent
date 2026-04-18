import type { AgentConfig } from "@opencode-ai/sdk";
export function createExplorerAgent(model: string): AgentConfig {
  return { description: "Explorer - Find code", mode: "subagent", model, prompt: "Find code patterns in the repository. Use grep, glob, and LSP tools to locate relevant code." };
}
