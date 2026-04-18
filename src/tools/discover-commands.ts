// discover-commands.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Sat Apr 18 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

import { loadBuiltinCommands, type BuiltinCommands } from "../features/builtin-commands/commands";

export interface CommandInfo {
  name: string;
  metadata: {
    name: string;
    description: string;
    argumentHint?: string;
    agent?: string;
  };
  content: string;
  scope: "builtin";
}

export function discoverBuiltinCommands(): CommandInfo[] {
  const commands = loadBuiltinCommands();
  
  return Object.values(commands).map((command) => ({
    name: command.name,
    metadata: {
      name: command.name,
      description: command.description || "",
      argumentHint: command.argumentHint,
      agent: command.agent,
    },
    content: command.template,
    scope: "builtin" as const,
  }));
}

export { loadBuiltinCommands, type BuiltinCommands };