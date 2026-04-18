export type AgentMode = "primary" | "subagent";

export function getAgentMode(name: string): AgentMode {
  const primaryAgents = ["sisyphus", "atlas", "prometheus", "designer", "hephaestus"];
  return primaryAgents.includes(name) ? "primary" : "subagent";
}