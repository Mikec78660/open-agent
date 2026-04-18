import type { AgentConfig } from "@opencode-ai/sdk";
export function createLibrarianAgent(model: string): AgentConfig {
  return { description: "Librarian - Search documentation", mode: "subagent", model, prompt: "Search external documentation sources. Use websearch and context7 to find relevant technical documentation and examples." };
}
