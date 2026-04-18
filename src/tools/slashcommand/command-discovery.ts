// command-discovery.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Sat Apr 18 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import { existsSync, readdirSync, readFileSync, statSync } from "fs"
import { basename, join } from "path"
import { loadBuiltinCommands, type BuiltinCommands } from "../../features/builtin-commands/commands"
import type { CommandDefinition } from "../../features/command-types"
import { log } from "../../shared/logger"

export interface CommandInfo {
  name: string
  metadata: {
    name: string
    description: string
    argumentHint?: string
    agent?: string
  }
  content: string
  scope: "builtin" | "plugin"
}

export interface CommandDiscoveryOptions {
  pluginsEnabled?: boolean
  enabledPluginsOverride?: Record<string, boolean>
}

/**
 * Discover builtin commands from the plugin
 */
function discoverBuiltinCommands(): CommandInfo[] {
  const builtinCommands = loadBuiltinCommands()
  const commandNames = Object.keys(builtinCommands)
  
  log("[discoverBuiltinCommands] Loaded commands:", commandNames);
  
  return Object.values(builtinCommands).map((command) => ({
    name: command.name,
    metadata: {
      name: command.name,
      description: command.description || "",
      argumentHint: command.argumentHint,
      agent: command.agent,
    },
    content: command.template,
    scope: "builtin" as const,
  }))
}

/**
 * Deduplicate commands by name
 */
function deduplicateCommandsByName(commands: CommandInfo[]): CommandInfo[] {
  const seen = new Set<string>()
  const deduplicatedCommands: CommandInfo[] = []

  for (const command of commands) {
    if (seen.has(command.name)) {
      continue
    }

    seen.add(command.name)
    deduplicatedCommands.push(command)
  }

  return deduplicatedCommands
}

/**
 * Discover all commands from the plugin
 * This is used by OpenCode to populate the / dropdown
 */
export function discoverCommandsSync(
  _directory?: string,
  _options?: CommandDiscoveryOptions,
): CommandInfo[] {
  const builtinCommands = discoverBuiltinCommands()
  const allCommands = deduplicateCommandsByName([
    ...builtinCommands,
  ])

  log("[discoverCommandsSync] Total commands:", allCommands.length);
  allCommands.forEach(cmd => log(`  - /${cmd.name}`));

  return allCommands
}

/**
 * Load builtin commands as a record (for backward compatibility)
 */
export function loadBuiltinCommandsAsRecord(): Record<string, CommandDefinition> {
  const builtinCommands = loadBuiltinCommands()
  const result: Record<string, CommandDefinition> = {}

  for (const [name, command] of Object.entries(builtinCommands)) {
    const { argumentHint, ...rest } = command
    result[name] = rest as CommandDefinition
  }

  return result
}
