import type { PluginContext } from "../plugin/types";
import type { OpenAgentConfig } from "../config/schema/open-agent-config";
export declare function createChatMessageHandler(args: {
    ctx: PluginContext;
    pluginConfig: OpenAgentConfig;
    hooks: any;
}): (input: unknown, output: unknown) => Promise<void>;
//# sourceMappingURL=chat-message.d.ts.map