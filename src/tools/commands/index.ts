import { tool, type ToolDefinition } from "@opencode-ai/plugin";

import { loadBuiltinCommands, type BuiltinCommands } from "../../features/builtin-commands/commands";
import { log } from "../../shared/logger";

export function createCommandsTool(): ToolDefinition {
  let cachedCommands: BuiltinCommands | null = null;

  const getCommands = (): BuiltinCommands => {
    if (!cachedCommands) {
      cachedCommands = loadBuiltinCommands();
      log("[commands tool] Loaded commands:", Object.keys(cachedCommands));
    }
    return cachedCommands;
  };

  const commands = getCommands();
  
  const lines: string[] = ["Available commands:\n"];
  for (const [name, cmd] of Object.entries(commands)) {
    lines.push(`  /${name}`);
    if (cmd.description) lines.push(`    ${cmd.description}`);
    if (cmd.argumentHint) lines.push(`    Usage: /${name} ${cmd.argumentHint}`);
    if (cmd.agent) lines.push(`    Agent: ${cmd.agent}`);
    lines.push("");
  }

  return tool({
    description: lines.join("\n"),
    args: {
      command: tool.schema.string().optional().describe("Command name to get details for"),
    },
    async execute(args: any) {
      const commands = getCommands();
      
      if (args.command) {
        const cmd = commands[args.command];
        if (!cmd) {
          return `Command /${args.command} not found. Available: ${Object.keys(commands).join(", ")}`;
        }
        return `Command: /${cmd.name}\n${cmd.description}\n\nTemplate:\n${cmd.template}`;
      }

      return `Available commands: ${Object.keys(commands).map((n) => `/${n}`).join(", ")}`;
    },
  });
}