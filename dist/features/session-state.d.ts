export declare const registeredAgentNames: Set<string>;
export declare const registeredAgentAliases: Map<string, string>;
export declare function registerAgentName(name: string): void;
export declare function isAgentRegistered(name: string): boolean;
export declare function resolveRegisteredAgentName(name: string | undefined): string | undefined;
export declare function setMainSession(id: string | undefined): void;
export declare function getMainSessionID(): string | undefined;
export declare const subagentSessions: Set<string>;
export declare const syncSubagentSessions: Set<string>;
//# sourceMappingURL=session-state.d.ts.map