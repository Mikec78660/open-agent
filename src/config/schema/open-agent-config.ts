import { z } from "zod";

const AgentInstanceSchema = z.object({
  model: z.string(),
  fallback: z.array(z.string()).optional(),
});

const AgentConfigSchema = z.object({
  mode: z.enum(["primary", "subagent"]).optional(),
  instances: z.array(AgentInstanceSchema),
});

export const OpenAgentConfigSchema = z.object({
  disabled_agents: z.array(z.enum(["sisyphus", "atlas", "explorer", "librarian", "prometheus", "oracle", "designer", "sisyphus-junior", "validator", "hephaestus", "athena", "metis", "momus", "oracle"])).optional(),
  agent_overrides: z.record(z.string(), z.any()).optional(),
  prompt_append: z.record(z.string(), z.string()).optional(),
  categories: z.record(z.string(), z.any()).optional(),
  agents: z.record(z.string(), AgentConfigSchema).optional(),
});

export type OpenAgentConfig = z.infer<typeof OpenAgentConfigSchema>;