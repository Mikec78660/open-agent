// index.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Tue Apr 21 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

import { tool, type ToolDefinition } from "@opencode-ai/plugin";
import type { DelegateTaskArgs } from "./types";
import { SimpleBackgroundManager } from "./manager";

export function createDelegateTask(manager: SimpleBackgroundManager): ToolDefinition {
  const description = `Spawn agent task with background execution support.

**IMPORTANT**: You MUST provide subagent_type for delegation.

**CORRECT - Using subagent_type:**
\`\`\`
task(subagent_type="sisyphus-junior", load_skills=[], description="Initialize project", prompt="...", run_in_background=true)
\`\`\`

Available agents (subagent_type):
- sisyphus: Backend/core logic
- athena: UI/frontend
- sisyphus-junior: Simple tasks
- validator: QA/verification

Parameters:
- subagent_type: REQUIRED - which agent to spawn
- load_skills: ALWAYS pass [] or specific skills
- description: Short task description
- prompt: Full task instructions
- run_in_background: true=async (don't wait), false=sync (wait for completion)

**Use run_in_background=true for parallel delegation of multiple independent tasks.**`;

  return tool({
    description,
    args: {
      subagent_type: tool.schema.string().describe("REQUIRED: Agent type (sisyphus, athena, sisyphus-junior, validator)"),
      load_skills: tool.schema.array(tool.schema.string()).describe("Always pass [] if no skills needed"),
      description: tool.schema.string().optional().describe("Short task description"),
      prompt: tool.schema.string().describe("Task instructions for the agent"),
      run_in_background: tool.schema.boolean().describe("true=async (no waiting), false=sync (wait for completion)"),
      parent_session_id: tool.schema.string().optional().describe("Parent session for context (auto-filled if not provided)"),
    },
    async execute(args: DelegateTaskArgs, toolContext) {
      const ctx = toolContext as { sessionID?: string };

      if (args.run_in_background === undefined) {
        return "Error: run_in_background parameter is REQUIRED. Use true for parallel delegation.";
      }

      if (!args.subagent_type) {
        return "Error: subagent_type is REQUIRED for delegation.";
      }

      const description = args.description || `Task: ${args.prompt.slice(0, 50)}`;

      if (args.run_in_background) {
        // Background execution - launch and return immediately
        const task = await manager.launch({
          description,
          prompt: args.prompt,
          agent: args.subagent_type,
          parentSessionID: ctx.sessionID || "main",
        });

        return `Background task launched.

Task ID: ${task.id}
Agent: ${task.agent}
Status: ${task.status}

Use task_status tool with task_id="${task.id}" to check progress. Do not run more than once every 90 seconds`;
      } else {
        // Sync execution - this would wait, but for now return instruction
        return `Sync execution requested. Use run_in_background=true for parallel delegation.
Task would run: ${description}
Agent: ${args.subagent_type}`;
      }
    },
  });
}
