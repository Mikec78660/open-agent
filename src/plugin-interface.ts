// plugin-interface.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { PluginContext, PluginInterface, ToolsRecord } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";

import { createChatParamsHandler } from "./plugin/chat-params";
import { createChatHeadersHandler } from "./plugin/chat-headers";
import { createChatMessageHandler } from "./plugin/chat-message";
import { createCommandExecuteBeforeHandler } from "./plugin/command-execute-before";
import { createSystemTransformHandler } from "./plugin/system-transform";
import { createToolExecuteAfterHandler } from "./plugin/tool-execute-after";
import { createToolExecuteBeforeHandler } from "./plugin/tool-execute-before";
import { createToolDefinitionHandler } from "./plugin/tool-definition";

import type { CreatedHooks } from "./create-hooks";
import type { Managers } from "./create-managers";

export function createPluginInterface(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
  managers: Managers;
  hooks: CreatedHooks;
  tools: ToolsRecord;
}): PluginInterface {
  const { ctx, pluginConfig, managers, hooks, tools } = args;

  return {
    tool: tools,

    "chat.params": async (input: unknown, output: unknown) => {
      return;
    },

    "chat.headers": async (input: unknown, output: unknown) => {
      return;
    },

    "command.execute.before": createCommandExecuteBeforeHandler({
      hooks,
    }),

    "chat.message": async (input: unknown, output: unknown) => {
      await hooks.backgroundNotificationHook?.["chat.message"]?.(
        input as { sessionID: string },
        output as { parts: Array<{ type: string; text?: string }> }
      );
      return createChatMessageHandler({ ctx, pluginConfig, hooks })(input, output);
    },

    "experimental.chat.system.transform": createSystemTransformHandler(),

    config: managers.configHandler,

    event: async (input: { event: any }) => {
       return;
     },

    "tool.execute.before": createToolExecuteBeforeHandler({
      ctx,
      hooks,
    }),

    "tool.execute.after": createToolExecuteAfterHandler({
       ctx,
       hooks,
     }),

     "tool.definition": createToolDefinitionHandler(),
  };
}
