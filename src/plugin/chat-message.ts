import { loadBuiltinCommands } from "../features/builtin-commands/commands";
import type { PluginContext } from "../plugin/types";
import type { OpenAgentConfig } from "../config/schema/open-agent-config";
import { log } from "../shared/logger";

const SLASH_COMMAND_PATTERN = /^\/([a-zA-Z@][\w.:@/-]*)\s*(.*)/;

interface ParsedSlashCommand {
  command: string;
  args: string;
  raw: string;
}

function parseSlashCommand(text: string): ParsedSlashCommand | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  const match = trimmed.match(SLASH_COMMAND_PATTERN);
  if (!match) {
    return null;
  }
  const [, command, args] = match;
  return {
    command: command.toLowerCase(),
    args: args.trim(),
    raw: match[0],
  };
}

interface Part {
  type: string;
  text?: string;
}

function findSlashCommandPartIndex(parts: Part[]): number {
  for (let idx = 0; idx < parts.length; idx++) {
    const part = parts[idx];
    if (part.type !== "text") continue;
    if ((part.text ?? "").trim().startsWith("/")) {
      return idx;
    }
  }
  return -1;
}

export function createChatMessageHandler(args: {
  ctx: PluginContext;
  pluginConfig: OpenAgentConfig;
  hooks: any;
}) {
  let cachedCommands: ReturnType<typeof loadBuiltinCommands> | null = null;

  const getCommands = () => {
     if (!cachedCommands) {
       cachedCommands = loadBuiltinCommands();
     }
     return cachedCommands;
   };

  return async (input: unknown, output: unknown) => {
      const inp = input as { parts?: Part[] };
      const out = output as { parts?: Part[] };
      const parts = out.parts;

     if (!parts || !Array.isArray(parts)) {
       return;
     }

    const textParts = parts.filter((p) => p.type === "text" && p.text);

      // Find slash part - handle JSON-encoded commands (e.g., "\"/command\"\n")
      const slashPart = textParts.find((p) => {
        const text = p.text ?? "";
        // Strip leading/trailing quotes and whitespace to find the actual slash command
        const normalized = text.trim();
        // If it starts with a quote, try to find the slash after it
        if (normalized.startsWith('"') && normalized.endsWith('"')) {
          const inner = normalized.slice(1, -1).trim();
          return inner.startsWith("/");
        }
        return normalized.startsWith("/");
      });

      if (!slashPart || !slashPart.text) {
        return;
      }

      // Extract the actual command text (handle JSON-encoded format)
      let commandText = slashPart.text.trim();
      if (commandText.startsWith('"') && commandText.endsWith('"')) {
        commandText = commandText.slice(1, -1).trim();
      }

      const parsed = parseSlashCommand(commandText);
      if (!parsed) {
        return;
      }

      const commands = getCommands();
      const command = commands[parsed.command];

      if (!command) {
        return;
      }

      log("[chat.message] Injecting template for:", parsed.command);

    const taggedContent = `<auto-slash-command>\n<command-instruction>\n${command.template}\n</command-instruction>\n</auto-slash-command>`;

    const slashIdx = findSlashCommandPartIndex(parts);
    if (slashIdx >= 0) {
      parts[slashIdx].text = taggedContent;
    }
  };
}