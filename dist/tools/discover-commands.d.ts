import { loadBuiltinCommands, type BuiltinCommands } from "../features/builtin-commands/commands";
export interface CommandInfo {
    name: string;
    metadata: {
        name: string;
        description: string;
        argumentHint?: string;
        agent?: string;
    };
    content: string;
    scope: "builtin";
}
export declare function discoverBuiltinCommands(): CommandInfo[];
export { loadBuiltinCommands, type BuiltinCommands };
//# sourceMappingURL=discover-commands.d.ts.map