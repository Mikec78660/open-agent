import type { CommandDefinition } from "../command-types";
import type { BuiltinCommandName } from "../../config/schema/commands";

export interface BuiltinCommands {
  [key: string]: CommandDefinition;
}

export type { BuiltinCommandName } from "../../config/schema/commands";