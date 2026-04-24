// index.ts
//  Task delegation tool with pool-based execution and fallback routing
//  Uses llama.cpp slot API for slot monitoring
//  Routes overflow tasks through fallback chain
//  Sends "All agents idle" notification when all slots go idle
//  
//  Created on: Wed Apr 22 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import { tool, type ToolDefinition } from "@opencode-ai/plugin";
import type { DelegateTaskArgs } from "./types";
import { SimpleBackgroundManager } from "./manager";

export function createDelegateTask(manager: SimpleBackgroundManager): ToolDefinition {
  const description = `Spawn agent task with pool-based execution and automatic fallback routing.

**Pool-based Delegation**: Tasks are routed to available agent slots. If all slots
for the requested agent are busy, tasks are automatically routed through the fallback chain.

**Fallback Chain**: sisyphus-junior tasks can fall back to sisyphus or athena if all
junior slots are busy. Other agents use their configured slots directly.

**CORRECT Usage:**
\`\`\`
task(subagent_type="sisyphus-junior", prompt="...", run_in_background=true)
task(subagent_type="athena", prompt="...", run_in_background=true)
\`\`\`

**Available Agents**:
- sisyphus-junior: Small tasks (3 slots, fallback to sisyphus or athena)
- sisyphus: Backend/core logic (1 slot)
- athena: UI/frontend (1 slot)
- validator: QA/verification (1 slot)
- explorer: Code search
- librarian: Documentation search
- oracle: Consultation

**Parameters**:
- subagent_type: REQUIRED - which agent pool to use
- prompt: Task instructions
- run_in_background: true=async (always recommended)

**Notifications**:
- When all builder agents complete: "All agents idle"
- Queued tasks are assigned automatically when slots become available`;

  return tool({
    description,
    args: {
      subagent_type: tool.schema.string().describe("REQUIRED: Agent pool (sisyphus-junior, athena, sisyphus, validator, etc.)"),
      load_skills: tool.schema.array(tool.schema.string()).describe("Always pass []"),
      description: tool.schema.string().describe("REQUIRED: Short task description/title"),
      prompt: tool.schema.string().describe("Task instructions for the agent"),
      run_in_background: tool.schema.boolean().describe("true=async, false=sync"),
      parent_session_id: tool.schema.string().optional().describe("Parent session"),
    },
    async execute(args: DelegateTaskArgs, toolContext) {
      const ctx = toolContext as { sessionID?: string };

      if (args.run_in_background === undefined) {
        return "Error: run_in_background is REQUIRED. Use true for parallel delegation.";
      }

      if (!args.subagent_type) {
        return "Error: subagent_type is REQUIRED.";
      }

      if (!args.description) {
        return "Error: description is REQUIRED.";
      }
      const description = args.description;

      if (args.run_in_background) {
        const task = await manager.launch({
          description,
          prompt: args.prompt,
          agent: args.subagent_type,
          parentSessionID: ctx.sessionID || "main",
        });

        let msg = `Background task launched.

Task ID: ${task.id}
Agent: ${task.requestedAgent}
Status: ${task.status}`;

        if (task.status === "queued") {
          msg += `\nTask queued - will be assigned when slot available.`;
        }

        return msg;
      } else {
        return `Error: Sync execution not supported. You MUST use run_in_background=true for all tasks including validator.`;
      }
    },
  });
}