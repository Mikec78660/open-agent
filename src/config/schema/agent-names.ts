import { z } from "zod";

export const AgentNameSchema = z.enum([
  "sisyphus",
  "atlas",
  "explorer",
  "librarian",
  "prometheus",
  "oracle",
  "designer",
  "sisyphus-junior",
  "validator",
  "hephaestus",
]);

export type AgentName = z.infer<typeof AgentNameSchema>;

export const DisabledAgentsSchema = z.array(AgentNameSchema).optional();

export const AgentOverrideSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  maxTokens: z.number().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  prompt_append: z.string().optional(),
});

export type AgentOverrideConfig = z.infer<typeof AgentOverrideSchema>;

export const AgentOverridesSchema = z.record(AgentNameSchema, AgentOverrideSchema);

export type AgentOverrides = z.infer<typeof AgentOverridesSchema>;
