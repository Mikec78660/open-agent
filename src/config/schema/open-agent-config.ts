import { z } from "zod";

export const OpenAgentConfigSchema = z.object({
  disabled_agents: z.array(z.enum(["sisyphus", "atlas", "explorer", "librarian", "prometheus", "oracle", "designer", "sisyphus-junior", "validator", "hephaestus"])).optional(),
  agent_overrides: z.record(z.string(), z.any()).optional(),
  prompt_append: z.record(z.string(), z.string()).optional(),
  categories: z.record(z.string(), z.any()).optional(),
  agents: z.record(z.string(), z.any()).optional(),
});

export type OpenAgentConfig = z.infer<typeof OpenAgentConfigSchema>;
