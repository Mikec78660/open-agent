// session-state.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Sat Apr 18 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

export const registeredAgentNames = new Set<string>();
export const registeredAgentAliases = new Map<string, string>();

export function registerAgentName(name: string): void {
  const normalizedName = name.toLowerCase();
  registeredAgentNames.add(normalizedName);
  if (!registeredAgentAliases.has(normalizedName)) {
    registeredAgentAliases.set(normalizedName, name);
  }
}

export function isAgentRegistered(name: string): boolean {
  return registeredAgentNames.has(name.toLowerCase());
}

export function resolveRegisteredAgentName(name: string | undefined): string | undefined {
  if (typeof name !== "string") return undefined;
  const normalized = name.toLowerCase();
  return registeredAgentAliases.get(normalized) ?? name;
}

export function setMainSession(id: string | undefined): void {}
export function getMainSessionID(): string | undefined { return undefined; }
export const subagentSessions = new Set<string>();
export const syncSubagentSessions = new Set<string>();