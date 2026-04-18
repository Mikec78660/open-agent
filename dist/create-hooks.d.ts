import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
export type CreatedHooks = {
    [key: string]: any;
};
export declare function createHooks(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
}): CreatedHooks;
//# sourceMappingURL=create-hooks.d.ts.map