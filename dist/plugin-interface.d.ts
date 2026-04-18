import type { PluginContext, PluginInterface, ToolsRecord } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
import type { CreatedHooks } from "./create-hooks";
import type { Managers } from "./create-managers";
export declare function createPluginInterface(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
    managers: Managers;
    hooks: CreatedHooks;
    tools: ToolsRecord;
}): PluginInterface;
//# sourceMappingURL=plugin-interface.d.ts.map