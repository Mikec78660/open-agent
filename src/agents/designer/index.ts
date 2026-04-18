import type { AgentConfig } from "@opencode-ai/sdk";
export function createDesignerAgent(model: string): AgentConfig {
  return { description: "Designer - UI/UX", mode: "primary", model, prompt: "Create beautiful, functional user interfaces. Use React, CSS, and modern design patterns to build polished frontend experiences." };
}
