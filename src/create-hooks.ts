// create-hooks.ts
//  Creates hooks including background notification injection
//  
//  Created on: Wed Apr 22 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
import { SimpleBackgroundManager } from "./tools/delegate-task/manager";

export type CreatedHooks = {
  [key: string]: any;
  backgroundNotificationHook?: {
    "chat.message": (input: { sessionID: string }, output: { parts: Array<{ type: string; text?: string }> }) => Promise<void>;
    event: (input: { event: { type: string } }) => Promise<void>;
  };
};

export function createHooks(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
  backgroundManager: SimpleBackgroundManager;
}): CreatedHooks {
  const { ctx, pluginConfig, backgroundManager } = args;

  const backgroundNotificationHook = {
    "chat.message": async (
      input: { sessionID: string },
      output: { parts: Array<{ type: string; text?: string }> }
    ) => {
      const notifications = backgroundManager.getPendingNotifications();
      if (notifications.length === 0) return;

      backgroundManager.clearPendingNotifications();
      
      const notificationText = notifications.join("\n\n");
      const firstTextPartIndex = output.parts.findIndex((p) => p.type === "text");

      if (firstTextPartIndex === -1) {
        output.parts.unshift({ type: "text", text: notificationText });
      } else {
        const originalText = output.parts[firstTextPartIndex].text ?? "";
        output.parts[firstTextPartIndex].text = `${notificationText}\n\n---\n\n${originalText}`;
      }
    },
    event: async (_input: { event: { type: string } }) => {
    },
  };

  return {
    backgroundNotificationHook,
  };
}