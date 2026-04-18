import type { PluginContext } from "./plugin/types";
declare const OpenAgentPlugin: (ctx: PluginContext) => Promise<{
    agent: Record<string, any>;
    config: (opencodeConfig: Record<string, unknown>) => Promise<void>;
    event?: ((input: {
        event: import("@opencode-ai/sdk").Event;
    }) => Promise<void>) | undefined;
    tool?: {
        [key: string]: import("@opencode-ai/plugin").ToolDefinition;
    } | undefined;
    auth?: import("@opencode-ai/plugin").AuthHook | undefined;
    provider?: import("@opencode-ai/plugin").ProviderHook | undefined;
    "chat.message"?: ((input: {
        sessionID: string;
        agent?: string;
        model?: {
            providerID: string;
            modelID: string;
        };
        messageID?: string;
        variant?: string;
    }, output: {
        message: import("@opencode-ai/sdk").UserMessage;
        parts: import("@opencode-ai/sdk").Part[];
    }) => Promise<void>) | undefined;
    "chat.params"?: ((input: {
        sessionID: string;
        agent: string;
        model: import("@opencode-ai/sdk").Model;
        provider: import("@opencode-ai/plugin").ProviderContext;
        message: import("@opencode-ai/sdk").UserMessage;
    }, output: {
        temperature: number;
        topP: number;
        topK: number;
        maxOutputTokens: number | undefined;
        options: Record<string, any>;
    }) => Promise<void>) | undefined;
    "permission.ask"?: ((input: import("@opencode-ai/sdk").Permission, output: {
        status: "ask" | "deny" | "allow";
    }) => Promise<void>) | undefined;
    "command.execute.before"?: ((input: {
        command: string;
        sessionID: string;
        arguments: string;
    }, output: {
        parts: import("@opencode-ai/sdk").Part[];
    }) => Promise<void>) | undefined;
    "tool.execute.before"?: ((input: {
        tool: string;
        sessionID: string;
        callID: string;
    }, output: {
        args: any;
    }) => Promise<void>) | undefined;
    "shell.env"?: ((input: {
        cwd: string;
        sessionID?: string;
        callID?: string;
    }, output: {
        env: Record<string, string>;
    }) => Promise<void>) | undefined;
    "tool.execute.after"?: ((input: {
        tool: string;
        sessionID: string;
        callID: string;
        args: any;
    }, output: {
        title: string;
        output: string;
        metadata: any;
    }) => Promise<void>) | undefined;
    "experimental.chat.messages.transform"?: ((input: {}, output: {
        messages: {
            info: import("@opencode-ai/sdk").Message;
            parts: import("@opencode-ai/sdk").Part[];
        }[];
    }) => Promise<void>) | undefined;
    "experimental.chat.system.transform"?: ((input: {
        sessionID?: string;
        model: import("@opencode-ai/sdk").Model;
    }, output: {
        system: string[];
    }) => Promise<void>) | undefined;
    "experimental.compaction.autocontinue"?: ((input: {
        sessionID: string;
        agent: string;
        model: import("@opencode-ai/sdk").Model;
        provider: import("@opencode-ai/plugin").ProviderContext;
        message: import("@opencode-ai/sdk").UserMessage;
        overflow: boolean;
    }, output: {
        enabled: boolean;
    }) => Promise<void>) | undefined;
    "experimental.text.complete"?: ((input: {
        sessionID: string;
        messageID: string;
        partID: string;
    }, output: {
        text: string;
    }) => Promise<void>) | undefined;
    "tool.definition"?: ((input: {
        toolID: string;
    }, output: {
        description: string;
        parameters: any;
    }) => Promise<void>) | undefined;
    "chat.headers"?: (input: {
        sessionID: string;
        agent: string;
        model: import("@opencode-ai/sdk").Model;
        provider: import("@opencode-ai/plugin").ProviderContext;
        message: import("@opencode-ai/sdk").UserMessage;
    }, output: {
        headers: Record<string, string>;
    }) => Promise<void>;
    name: string;
}>;
export default OpenAgentPlugin;
//# sourceMappingURL=index.d.ts.map