// create-managers.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
import { loadBuiltinCommands, type BuiltinCommands } from "./features/builtin-commands/commands";
import { log } from "./shared/logger";

type ConfigHandler = (input: unknown, output: unknown) => Promise<void>;

export function createConfigHandler(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
}): any {
  return async (config: Record<string, unknown>): Promise<void> => {
    // Load builtin commands from the plugin
    const builtinCommands = loadBuiltinCommands();
    
    // Convert to command definitions for OpenCode
    const commandDefinitions: Record<string, unknown> = {};
    for (const [name, cmd] of Object.entries(builtinCommands)) {
      commandDefinitions[name] = {
        description: cmd.description,
        template: cmd.template,
        agent: cmd.agent,
        argumentHint: cmd.argumentHint,
      };
    }
    
    // Add commands to config.command so they appear in the / dropdown
    config.command = {
      ...(config.command as Record<string, unknown>),
      ...commandDefinitions,
    };
    
    log("[config handler] Added commands:", Object.keys(commandDefinitions));
  };
}

import type { SimpleBackgroundManager } from "./tools/delegate-task/manager";

export type Managers = {
  configHandler: ReturnType<typeof createConfigHandler>;
  backgroundManager: SimpleBackgroundManager;
};

export function createManagers(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
  backgroundManager: SimpleBackgroundManager;
}): Managers {
  const { ctx, pluginConfig, backgroundManager } = args;

  const configHandler = createConfigHandler({
    ctx: ctx,
    pluginConfig,
  });

  return {
    configHandler,
    backgroundManager,
  };
}
