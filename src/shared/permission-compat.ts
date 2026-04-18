// permission-compat.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

import type { AgentConfig } from "@opencode-ai/sdk";

export function createAgentToolRestrictions(blockedTools: string[]): Partial<AgentConfig> {
  const permission: Record<string, "allow" | "deny"> = {};
  
  for (const tool of blockedTools) {
    permission[tool] = "deny";
  }
  
  permission.question = "allow";
  
  return { permission: permission as AgentConfig["permission"] };
}