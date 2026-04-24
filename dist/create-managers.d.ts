import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
export declare function createConfigHandler(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
}): any;
import type { SimpleBackgroundManager } from "./tools/delegate-task/manager";
export type Managers = {
    configHandler: ReturnType<typeof createConfigHandler>;
    backgroundManager: SimpleBackgroundManager;
};
export declare function createManagers(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
    backgroundManager: SimpleBackgroundManager;
}): Managers;
//# sourceMappingURL=create-managers.d.ts.map