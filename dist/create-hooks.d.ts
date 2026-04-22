import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
import { SimpleBackgroundManager } from "./tools/delegate-task/manager";
export type CreatedHooks = {
    [key: string]: any;
    backgroundNotificationHook?: {
        "chat.message": (input: {
            sessionID: string;
        }, output: {
            parts: Array<{
                type: string;
                text?: string;
            }>;
        }) => Promise<void>;
        event: (input: {
            event: {
                type: string;
            };
        }) => Promise<void>;
    };
};
export declare function createHooks(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
    backgroundManager: SimpleBackgroundManager;
}): CreatedHooks;
//# sourceMappingURL=create-hooks.d.ts.map