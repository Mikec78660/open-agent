// agent-names.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

/**
 * Agent Names for the Open-Agent Plugin
 * 
 * This plugin uses name-based agent routing instead of categories.
 * All 10 agents are designated by name.
 */

export type AgentName =
  | "sisyphus"
  | "atlas"
  | "explorer"
  | "librarian"
  | "prometheus"
  | "oracle"
  | "designer"
  | "sisyphus-junior"
  | "validator"
  | "hephaestus";

// Array of all agent names for iteration
export const ALL_AGENT_NAMES: AgentName[] = [
  "sisyphus",
  "atlas",
  "explorer",
  "librarian",
  "prometheus",
  "oracle",
  "designer",
  "sisyphus-junior",
  "validator",
  "hephaestus",
];

// Primary agents - use UI-selected model, have full capabilities
export const PRIMARY_AGENTS: AgentName[] = [
  "sisyphus",
  "atlas",
  "prometheus",
  "designer",
  "hephaestus",
];

// Subagent mode agents - use their own model, limited capabilities
export const SUBAGENT_NAMES: AgentName[] = [
  "explorer",
  "librarian",
  "oracle",
  "sisyphus-junior",
  "validator",
];

/**
 * Check if an agent name is a primary agent
 */
export function isPrimaryAgent(name: string): boolean {
  return PRIMARY_AGENTS.includes(name as AgentName);
}

/**
 * Check if an agent name is a subagent
 */
export function isSubagent(name: string): boolean {
  return SUBAGENT_NAMES.includes(name as AgentName);
}