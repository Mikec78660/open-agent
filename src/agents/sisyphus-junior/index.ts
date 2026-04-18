import type { AgentConfig } from "@opencode-ai/sdk";
export function createSisyphusJuniorAgent(model: string): AgentConfig {
  return { description: "Sisyphus-Junior - Executor", mode: "subagent", model, prompt: "Execute code tasks. No delegation. Fix bugs, add features." };
}
