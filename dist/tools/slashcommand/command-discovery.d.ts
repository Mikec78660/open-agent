import type { CommandDefinition } from "../../features/command-types";
export interface CommandInfo {
    name: string;
    metadata: {
        name: string;
        description: string;
        argumentHint?: string;
        agent?: string;
    };
    content: string;
    scope: "builtin" | "plugin";
}
export interface CommandDiscoveryOptions {
    pluginsEnabled?: boolean;
    enabledPluginsOverride?: Record<string, boolean>;
}
/**
 * Discover all commands from the plugin
 * This is used by OpenCode to populate the / dropdown
 */
export declare function discoverCommandsSync(_directory?: string, _options?: CommandDiscoveryOptions): CommandInfo[];
/**
 * Load builtin commands as a record (for backward compatibility)
 */
export declare function loadBuiltinCommandsAsRecord(): Record<string, CommandDefinition>;
//# sourceMappingURL=command-discovery.d.ts.map