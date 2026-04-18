import type { DelegateTaskToolOptions } from "./types";
import { log } from "../../shared/logger";
import { tool, type ToolDefinition } from "@opencode-ai/plugin";

export { buildSystemContent } from "./prompt-builder";
export type { DelegateTaskToolOptions, BuildSystemContentInput } from "./types";

export function createDelegateTask(options: DelegateTaskToolOptions): ToolDefinition {
  log("createDelegateTask called", { directory: options.directory });
  
  return tool({
    description: "Spawn agent task with category-based or direct agent selection.",
    args: {
      load_skills: tool.schema.array(tool.schema.string()).describe("Skill names to inject. REQUIRED - pass [] if no skills needed."),
      description: tool.schema.string().optional().describe("Short task description (3-5 words). Auto-generated from prompt if omitted."),
      prompt: tool.schema.string().describe("Full detailed prompt for the agent"),
      run_in_background: tool.schema.boolean().describe("REQUIRED. true=async (returns task_id), false=sync (waits)."),
      category: tool.schema.string().optional().describe("Category for task delegation (e.g., 'quick', 'research', 'dev')"),
      subagent_type: tool.schema.string().optional().describe("Specific agent to use (explore, librarian, oracle, etc.)"),
      session_id: tool.schema.string().optional().describe("Existing Task session to continue"),
      command: tool.schema.string().optional().describe("The command that triggered this task"),
    },
    async execute(args: any, toolContext) {
      return "Task execution not yet implemented";
    },
  });
}