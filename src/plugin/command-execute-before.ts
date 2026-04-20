import { loadBuiltinCommands } from "../features/builtin-commands/commands";
import type { CreatedHooks } from "../create-hooks";
import { log } from "../shared/logger";

export function createCommandExecuteBeforeHandler(args: {
  hooks: CreatedHooks;
}) {
  let cachedCommands: ReturnType<typeof loadBuiltinCommands> | null = null;

  const getCommands = () => {
    if (!cachedCommands) {
      cachedCommands = loadBuiltinCommands();
    }
    return cachedCommands;
  };

  return async (input: unknown, output: unknown): Promise<void> => {
      const cmdInput = input as { command: string; arguments?: string };
      const cmdOutput = output as { parts: Array<{ type: string; text: string }> };

      const commandName = cmdInput.command.toLowerCase();
      const commands = getCommands();
      const command = commands[commandName];

      if (!command) {
        return;
      }

      const hasCommandInstruction = cmdOutput.parts.some(
        (p) => p.type === "text" && p.text.includes("<command-instruction>")
      );

      if (hasCommandInstruction) {
        log("[command.execute.before] Skipping injection - already present for:", commandName);
        return;
      }

      log("[command.execute.before] Injecting template for:", commandName);

    const taggedContent = `<command-instruction>\n${command.template}\n</command-instruction>`;

    const slashIndex = cmdOutput.parts.findIndex(
      (p) => p.type === "text" && p.text.startsWith("/")
    );
    if (slashIndex >= 0) {
      cmdOutput.parts[slashIndex].text = taggedContent + "\n" + (cmdInput.arguments || "");
    } else {
      cmdOutput.parts.unshift({ type: "text", text: taggedContent });
    }
  };
}