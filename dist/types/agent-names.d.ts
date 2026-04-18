/**
 * Agent Names for the Open-Agent Plugin
 *
 * This plugin uses name-based agent routing instead of categories.
 * All 10 agents are designated by name.
 */
export type AgentName = "sisyphus" | "atlas" | "explorer" | "librarian" | "prometheus" | "oracle" | "designer" | "sisyphus-junior" | "validator" | "hephaestus";
export declare const ALL_AGENT_NAMES: AgentName[];
export declare const PRIMARY_AGENTS: AgentName[];
export declare const SUBAGENT_NAMES: AgentName[];
/**
 * Check if an agent name is a primary agent
 */
export declare function isPrimaryAgent(name: string): boolean;
/**
 * Check if an agent name is a subagent
 */
export declare function isSubagent(name: string): boolean;
//# sourceMappingURL=agent-names.d.ts.map