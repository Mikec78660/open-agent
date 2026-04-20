import { createSisyphusAgent } from "./agents/sisyphus";
import { createAtlasAgent } from "./agents/atlas";
import { createExplorerAgent } from "./agents/explorer";
import { createLibrarianAgent } from "./agents/librarian";
import { createPrometheusAgent } from "./agents/prometheus";
import { createOracleAgent } from "./agents/oracle";
import { createDesignerAgent } from "./agents/designer";
import { createAthenaAgent } from "./agents/athena";
import { createSisyphusJuniorAgent } from "./agents/sisyphus-junior";
import { createValidatorAgent } from "./agents/validator";
import { createHephaestusAgent } from "./agents/hephaestus";
import { createMetisAgent } from "./agents/metis";
import { createMomusAgent } from "./agents/momus";

import { createPluginInterface } from "./plugin-interface";
import { createTools } from "./create-tools";
import { createHooks } from "./create-hooks";
import { createManagers } from "./create-managers";

import { loadPluginConfig } from "./config/loader";
import type { PluginContext } from "./plugin/types";
import type { OpenAgentConfig } from "./config/schema/open-agent-config";

const OpenAgentPlugin = async (ctx: PluginContext) => {
  const config = loadPluginConfig(ctx.directory);
  console.log("[open-agent] Loaded config:", JSON.stringify(config, null, 2));

  const agents: Record<string, any> = {
    sisyphus: createSisyphusAgent("anthropic/claude-sonnet-4-6"),
    atlas: createAtlasAgent("anthropic/claude-sonnet-4-6"),
    explorer: createExplorerAgent("anthropic/claude-sonnet-4-6"),
    librarian: createLibrarianAgent("anthropic/claude-sonnet-4-6"),
    prometheus: createPrometheusAgent("anthropic/claude-sonnet-4-6"),
    oracle: createOracleAgent("anthropic/claude-sonnet-4-6"),
    designer: createDesignerAgent("anthropic/claude-sonnet-4-6"),
    athena: createAthenaAgent("anthropic/claude-sonnet-4-6"),
    "sisyphus-junior": createSisyphusJuniorAgent("anthropic/claude-sonnet-4-6"),
    validator: createValidatorAgent("anthropic/claude-sonnet-4-6"),
    hephaestus: createHephaestusAgent("anthropic/claude-sonnet-4-6"),
    metis: createMetisAgent("anthropic/claude-sonnet-4-6"),
    momus: createMomusAgent("anthropic/claude-sonnet-4-6"),
  };

  for (const [agentName, agentConfig] of Object.entries(config.agents ?? {})) {
    if (agentConfig.model && agents[agentName]) {
      agents[agentName].model = agentConfig.model;
    }
  }

  const managers = createManagers({ ctx, pluginConfig: config });

  const toolsResult = await createTools({
    ctx,
    pluginConfig: config,
  });

  const hooks = createHooks({
    ctx,
    pluginConfig: config,
  });

  const pluginInterface = createPluginInterface({
    ctx,
    pluginConfig: config,
    managers,
    hooks,
    tools: toolsResult.filteredTools,
  });

  return {
    name: "open-agent",
    ...pluginInterface,
    agent: agents,
    config: async (opencodeConfig: Record<string, unknown>) => {
      if (pluginInterface.config) {
        await pluginInterface.config(opencodeConfig as any);
      }
      
      if (!opencodeConfig.agent) {
        opencodeConfig.agent = { ...agents };
      } else {
        Object.assign(opencodeConfig.agent, agents);
      }
    },
  };
};

export default OpenAgentPlugin;
