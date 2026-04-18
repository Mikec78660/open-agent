import type { OpenAgentConfig } from './schema/open-agent-config';
/**
 * Load plugin configuration from user and project config files.
 *
 * Configuration is loaded from:
 * 1. User config: ~/.config/opencode/open-agent.jsonc or .json
 * 2. Project config: <directory>/.opencode/open-agent.jsonc or .json
 *
 * Project config takes precedence over user config.
 */
export declare function loadPluginConfig(directory: string): OpenAgentConfig;
//# sourceMappingURL=loader.d.ts.map