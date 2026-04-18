import type { ToolDefinition } from "@opencode-ai/plugin";
import { type BuiltinCommands } from "./features/builtin-commands/commands";
import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";
export type CreateToolsResult = {
    filteredTools: Record<string, ToolDefinition>;
    builtinCommands: BuiltinCommands;
};
export declare function createTools(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
}): Promise<CreateToolsResult>;
//# sourceMappingURL=create-tools.d.ts.map