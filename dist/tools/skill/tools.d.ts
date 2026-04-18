import { type ToolDefinition } from "@opencode-ai/plugin";
import type { CommandInfo } from "../slashcommand/command-discovery";
export interface SkillLoadOptions {
    commands?: CommandInfo[];
}
export declare const TOOL_DESCRIPTION_PREFIX = "Load a skill or execute a slash command to get detailed instructions for a specific task.\n\nSkills and commands provide specialized knowledge and step-by-step guidance.\nUse this when a task matches an available skill's or command's description.\n\n**How to use:**\n- Call with a skill name: name='review-work'\n- Call with a command name (without leading slash): name='publish'\n- The tool will return detailed instructions with your context applied.\n";
export declare const TOOL_DESCRIPTION_NO_SKILLS = "Load a skill or execute a slash command to get detailed instructions for a specific task. No skills are currently available.";
export declare function formatCombinedDescription(commands: CommandInfo[]): string;
export declare function createSkillTool(options?: SkillLoadOptions): ToolDefinition;
//# sourceMappingURL=tools.d.ts.map