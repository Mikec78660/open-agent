// create-tools.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { ToolDefinition, Plugin } from "@opencode-ai/plugin";

import { createCommandsTool } from "./tools/commands";
import { createSkillTool } from "./tools/skill/tools";
import { discoverCommandsSync } from "./tools/slashcommand/command-discovery";
import { loadBuiltinCommands, type BuiltinCommands } from "./features/builtin-commands/commands";
import { createDelegateTask } from "./tools/delegate-task";
import { SimpleBackgroundManager } from "./tools/delegate-task/manager";
import { createTaskStatusTool } from "./tools/delegate-task/task-status";
import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
import { log } from "./shared/logger";

export type CreateToolsResult = {
  filteredTools: Record<string, ToolDefinition>;
  builtinCommands: BuiltinCommands;
  backgroundManager: SimpleBackgroundManager;
};

export async function createTools(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
  backgroundManager: SimpleBackgroundManager;
}): Promise<CreateToolsResult> {
  const { ctx, pluginConfig, backgroundManager } = args;

  log("[createTools] Creating tools...");

  // Load builtin commands from the plugin
  const builtinCommands = loadBuiltinCommands();

  // Discover all commands for the skill tool (used for / dropdown)
  const discoveredCommands = discoverCommandsSync(ctx.directory);

  // Background manager for task delegation is provided via args

  // Create delegate task tool with background support
  const delegateTaskTool = createDelegateTask(backgroundManager);
  const taskStatusTool = createTaskStatusTool(backgroundManager);

  // Create a simple tool registry
  const commandsTool = createCommandsTool();
  const skillTool = createSkillTool({ commands: discoveredCommands });
  const allTools: Record<string, ToolDefinition> = {
    commands: commandsTool,
    skill: skillTool,
    task: delegateTaskTool,
    task_status: taskStatusTool,
  };

  log("[createTools] Created tools:", Object.keys(allTools));
  log("[createTools] Loaded builtin commands:", Object.keys(builtinCommands));

  return {
    filteredTools: allTools,
    builtinCommands,
    backgroundManager,
  };
}