import type { AgentConfig } from "@opencode-ai/sdk";
export function createValidatorAgent(model: string): AgentConfig {
  return { description: "Validator - Validate code", mode: "subagent", model, prompt: "Run diagnostics. Verify tests pass. Check code quality." };
}
