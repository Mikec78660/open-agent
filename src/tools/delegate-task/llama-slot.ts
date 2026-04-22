// llama-slot.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Wed Apr 22 2026
//      Author: off-Server/Qwen3.5-9B.Q8_0

// llama-slot.ts
//  Polls llama.cpp server slots to determine if agent tasks are still running
//  Reads opencode.json for provider baseURLs and model slot IDs
//  Reads open-agent.json for agent configs
//  
//  Created on: Wed Apr 22 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const CONFIG_DIR = "/root/.config/opencode";
const OPENCODE_CONFIG = join(CONFIG_DIR, "opencode.json");
const OPENAGENT_CONFIG = join(CONFIG_DIR, "open-agent.json");

export interface AgentInstance {
  agentType: string;
  instanceIndex: number;
  model: string;
  providerID: string;
  modelID: string;
  llamaModelID: string;
  slotId: number;
  fallback?: string[];
}

export interface AgentConfig {
  instances: AgentInstance[];
  baseURL: string;
}

let configsLoaded = false;
let providerBaseURLs = new Map<string, string>();
let modelSlotIds = new Map<string, number>();
let agentConfigs = new Map<string, AgentConfig>();

async function loadConfigs(): Promise<void> {
  if (configsLoaded) return;

  const [opencodeRaw, openagentRaw] = await Promise.all([
    readFile(OPENCODE_CONFIG, "utf-8"),
    readFile(OPENAGENT_CONFIG, "utf-8"),
  ]);

  const opencode = JSON.parse(opencodeRaw);
  const openagent = JSON.parse(openagentRaw);

  for (const [providerID, provider] of Object.entries(opencode.provider as Record<string, any>)) {
    if (provider.options?.baseURL) {
      providerBaseURLs.set(providerID, provider.options.baseURL);
    }

    for (const [modelID, model] of Object.entries(provider.models as Record<string, any>)) {
      if (model.options?.id_slot !== undefined) {
        const fullModelID = modelID;
        modelSlotIds.set(fullModelID, model.options.id_slot);
      }
    }
  }

  for (const [agentType, config] of Object.entries(openagent.agents as Record<string, any>)) {
    const agentConfig = config as { mode?: string; instances?: any[] };
    if (!agentConfig.instances) continue;

    const instances: AgentInstance[] = [];
    let baseURL = "";

    for (let i = 0; i < agentConfig.instances.length; i++) {
      const instance = agentConfig.instances[i];
      const [providerID, modelID] = instance.model.split("/");
      const slotId = modelSlotIds.get(modelID) ?? 0;
      const llamaModelID = modelID.replace(/-\d+$/, "");

      if (!baseURL) {
        baseURL = providerBaseURLs.get(providerID) ?? "";
      }

      instances.push({
        agentType,
        instanceIndex: i,
        model: instance.model,
        providerID,
        modelID,
        llamaModelID,
        slotId,
        fallback: instance.fallback,
      });
    }

    agentConfigs.set(agentType, { instances, baseURL });
  }

  configsLoaded = true;
}

export async function getAgentConfig(agentType: string): Promise<AgentConfig | undefined> {
  await loadConfigs();
  return agentConfigs.get(agentType);
}

export async function getAllAgentTypes(): Promise<string[]> {
  await loadConfigs();
  return Array.from(agentConfigs.keys());
}

export async function isSlotBusy(providerID: string, llamaModelID: string, slotId: number): Promise<boolean> {
  await loadConfigs();
  const baseURL = providerBaseURLs.get(providerID);

  if (!baseURL) {
    throw new Error(`Unknown provider: ${providerID}`);
  }

  try {
    const response = await fetch(`${baseURL}/slots?model=${llamaModelID}`);
    if (!response.ok) {
      throw new Error(`Failed to query slots: ${response.status}`);
    }

    const slots: Array<{ id: number; is_processing: boolean }> = (await response.json()) as Array<{ id: number; is_processing: boolean }>;
    const slot = slots.find((s) => s.id === slotId);
    return slot?.is_processing ?? false;
  } catch (err) {
    throw new Error(`Provider ${providerID} unreachable: ${err}`);
  }
}

export async function isAgentIdle(agentType: string): Promise<boolean> {
  const config = await getAgentConfig(agentType);
  if (!config) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  for (const instance of config.instances) {
    const busy = await isSlotBusy(instance.providerID, instance.llamaModelID, instance.slotId);
    if (busy) return false;
  }
  return true;
}

export async function getIdleInstance(agentType: string): Promise<AgentInstance | undefined> {
  const config = await getAgentConfig(agentType);
  if (!config) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  for (const instance of config.instances) {
    const busy = await isSlotBusy(instance.providerID, instance.llamaModelID, instance.slotId);
    if (!busy) return instance;
  }
  return undefined;
}

export async function getFallbackInstance(agentType: string): Promise<AgentInstance | undefined> {
  const config = await getAgentConfig(agentType);
  if (!config) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const firstInstance = config.instances[0];
  if (!firstInstance?.fallback) return undefined;

  for (const fallbackAgent of firstInstance.fallback) {
    const idleInstance = await getIdleInstance(fallbackAgent);
    if (idleInstance) {
      return {
        ...idleInstance,
        fallback: undefined,
      };
    }
  }
  return undefined;
}

export async function anyAgentBusy(): Promise<boolean> {
  await loadConfigs();

  for (const [agentType, config] of agentConfigs.entries()) {
    for (const instance of config.instances) {
      const busy = await isSlotBusy(instance.providerID, instance.modelID, instance.slotId);
      if (busy) return true;
    }
  }
  return false;
}