// loader.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Sat Apr 18 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { OpenAgentConfigSchema } from './schema/open-agent-config';
import type { OpenAgentConfig } from './schema/open-agent-config';

/**
 * Get the user's configuration directory following XDG Base Directory specification.
 * Falls back to ~/.config if XDG_CONFIG_HOME is not set.
 */
function getUserConfigDir(): string {
  return process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
}

/**
 * Load and validate plugin configuration from a specific file path.
 */
function loadConfigFromPath(configPath: string): OpenAgentConfig | null {
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    const rawConfig = JSON.parse(content);
    const result = OpenAgentConfigSchema.safeParse(rawConfig);

    if (!result.success) {
      console.warn(`[open-agent] Invalid config at ${configPath}:`);
      console.warn(result.error.format());
      return null;
    }

    return result.data;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code !== 'ENOENT'
    ) {
      console.warn(
        `[open-agent] Error reading config from ${configPath}:`,
        error.message,
      );
    }
    return null;
  }
}

/**
 * Find existing config file path, preferring .jsonc over .json.
 */
function findConfigPath(basePath: string): string | null {
  const jsoncPath = `${basePath}.jsonc`;
  const jsonPath = `${basePath}.json`;

  if (fs.existsSync(jsoncPath)) {
    return jsoncPath;
  }
  if (fs.existsSync(jsonPath)) {
    return jsonPath;
  }
  return null;
}

/**
 * Load plugin configuration from user and project config files.
 * 
 * Configuration is loaded from:
 * 1. User config: ~/.config/opencode/open-agent.jsonc or .json
 * 2. Project config: <directory>/.opencode/open-agent.jsonc or .json
 * 
 * Project config takes precedence over user config.
 */
export function loadPluginConfig(directory: string): OpenAgentConfig {
  const userConfigBasePath = path.join(
    getUserConfigDir(),
    'opencode',
    'open-agent',
  );

  const projectConfigBasePath = path.join(
    directory,
    '.opencode',
    'open-agent',
  );

  const userConfigPath = findConfigPath(userConfigBasePath);
  const projectConfigPath = findConfigPath(projectConfigBasePath);

  let config: OpenAgentConfig = userConfigPath
    ? (loadConfigFromPath(userConfigPath) ?? {})
    : {};

  const projectConfig = projectConfigPath
    ? loadConfigFromPath(projectConfigPath)
    : null;

  if (projectConfig) {
    const mergedAgents = {
      ...(config.agents ?? {}),
      ...projectConfig.agents,
    };
    config = {
      ...config,
      ...projectConfig,
      agents: mergedAgents,
    };
  }

  return config;
}
