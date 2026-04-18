import type { AgentConfig } from "@opencode-ai/sdk";
export function createPrometheusAgent(model: string): AgentConfig {
  return { description: "Prometheus - Planner", mode: "primary", model, prompt: "Plan projects from scratch. Ask clarifying questions. Create detailed work plans and task breakdowns." };
}
