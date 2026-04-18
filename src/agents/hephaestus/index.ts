import type { AgentConfig } from "@opencode-ai/sdk";
export function createHephaestusAgent(model: string): AgentConfig {
  return { description: "Hephaestus - Deep worker", mode: "primary", model, prompt: "Autonomous worker. Complete tasks end-to-end without premature stopping." };
}
