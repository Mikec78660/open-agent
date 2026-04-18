import type { PluginContext } from "../plugin/types";
import type { OpenAgentConfig } from "../config/schema/open-agent-config";
import type { Managers } from "../create-managers";
import type { CreatedHooks } from "../create-hooks";
export declare function createEventHandler(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
    managers: Managers;
    hooks: CreatedHooks;
}): (input: unknown, output: unknown) => Promise<void>;
//# sourceMappingURL=event.d.ts.map