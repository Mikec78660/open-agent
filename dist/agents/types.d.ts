import type { AgentConfig } from "@opencode-ai/sdk";
export type { AgentConfig };
export type AgentMode = "primary" | "subagent" | "all";
export interface AgentPromptMetadata {
    category: "exploration" | "specialist" | "advisor" | "utility";
    cost: "FREE" | "CHEAP" | "EXPENSIVE";
    promptAlias: string;
    triggers: Array<{
        domain: string;
        trigger: string;
    }>;
    keyTrigger?: string;
    useWhen?: string[];
    avoidWhen?: string[];
}
export declare function isGptModel(model: string): boolean;
export declare function isGeminiModel(model: string): boolean;
//# sourceMappingURL=types.d.ts.map