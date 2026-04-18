import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
export declare function createConfigHandler(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
}): any;
export type Managers = {
    configHandler: ReturnType<typeof createConfigHandler>;
};
export declare function createManagers(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
}): Managers;
//# sourceMappingURL=create-managers.d.ts.map