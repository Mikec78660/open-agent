// tool-definition.ts
// Handle OpenCode's tool.definition hook to expose command information
import { loadBuiltinCommands, type BuiltinCommands } from "../features/builtin-commands/commands";
import { log } from "../shared/logger";

export function createToolDefinitionHandler(): (input: unknown, output: unknown) => Promise<void> {
  let cachedCommands: BuiltinCommands | null = null;

  const getCommands = (): BuiltinCommands => {
    if (!cachedCommands) {
      cachedCommands = loadBuiltinCommands();
    }
    return cachedCommands;
  };

  return async (input: unknown, output: unknown): Promise<void> => {
    const toolInput = input as { toolID: string };
    const toolOutput = output as { description: string; parameters: any };

   // Only handle the 'commands' tool
     // The 'skill' tool has its own description format with <available_items>
     if (toolInput.toolID !== 'commands') {
       return;
     }

     const commands = getCommands();
     
     // Build the description for all commands
     const lines: string[] = ['Available commands:\n'];
     for (const [name, cmd] of Object.entries(commands)) {
       lines.push(`  /${name}`);
       if (cmd.description) lines.push(`    ${cmd.description}`);
       if (cmd.argumentHint) lines.push(`    Usage: /${name} ${cmd.argumentHint}`);
       if (cmd.agent) lines.push(`    Agent: ${cmd.agent}`);
       lines.push('');
     }

    // Only overwrite description for 'commands' tool, not 'skill' tool
    // The 'skill' tool has its own description format with <available_items>
    if (toolInput.toolID === 'commands') {
      toolOutput.description = lines.join('\n');
    }
    toolOutput.parameters = {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Command name to get details for',
        },
      },
    };
  };
 }
