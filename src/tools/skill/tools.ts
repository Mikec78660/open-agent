import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import type { CommandInfo } from "../slashcommand/command-discovery"

export interface SkillLoadOptions {
  commands?: CommandInfo[]
}

// Constants from open-agent-1
export const TOOL_DESCRIPTION_PREFIX = `Load a skill or execute a slash command to get detailed instructions for a specific task.

Skills and commands provide specialized knowledge and step-by-step guidance.
Use this when a task matches an available skill's or command's description.

**How to use:**
- Call with a skill name: name='review-work'
- Call with a command name (without leading slash): name='publish'
- The tool will return detailed instructions with your context applied.
`

export const TOOL_DESCRIPTION_NO_SKILLS = "Load a skill or execute a slash command to get detailed instructions for a specific task. No skills are currently available."

// Scope priority for sorting commands
const SCOPE_PRIORITY: Record<string, number> = {
  project: 4,
  user: 3,
  opencode: 2,
  "opencode-project": 2,
  plugin: 1,
  config: 1,
  builtin: 1,
}

function sortByScopePriority<TItem extends { scope: string }>(items: TItem[]): TItem[] {
  return [...items].sort((left, right) => {
    const leftPriority = SCOPE_PRIORITY[left.scope] || 0
    const rightPriority = SCOPE_PRIORITY[right.scope] || 0
    return rightPriority - leftPriority
  })
}

function formatSlashCommand(command: CommandInfo): string {
  const argumentHint = typeof command.metadata.argumentHint === "string"
    ? command.metadata.argumentHint.trim()
    : undefined
  const lines = [
    "  <command>",
    `    <name>/${command.name}</name>`,
    `    <description>${command.metadata.description || "(no description)"}</description>`,
    `    <scope>${command.scope}</scope>`,
  ]

  if (argumentHint) {
    lines.push(`    <argument>${argumentHint}</argument>`)
  }

  lines.push("  </command>")
  return lines.join("\n")
}

export function formatCombinedDescription(commands: CommandInfo[]): string {
  if (commands.length === 0) {
    return TOOL_DESCRIPTION_NO_SKILLS
  }

  const availableItems = sortByScopePriority(commands).map(formatSlashCommand)

  if (availableItems.length === 0) {
    return TOOL_DESCRIPTION_PREFIX
  }

  return `${TOOL_DESCRIPTION_PREFIX}
<available_items>
Priority: project > user > opencode > builtin/plugin | Skills listed before commands
Invoke via: skill(name="item-name") - omit leading slash for commands.
${availableItems.join("\n")}
</available_items>`
}

export function createSkillTool(options: SkillLoadOptions = {}): ToolDefinition {
  let cachedDescription: string | null = null

  const getCommands = (): CommandInfo[] => {
    if (options.commands) {
      return options.commands
    }
    // Import dynamically to avoid circular dependencies
    return require("../slashcommand/command-discovery").discoverCommandsSync()
  }

  const buildDescription = (force = false): string => {
    if (!force && cachedDescription) return cachedDescription
    
    const commands = getCommands()
    cachedDescription = formatCombinedDescription(commands)
    return cachedDescription
  }

  if (options.commands !== undefined) {
    cachedDescription = buildDescription()
  } else {
    void buildDescription()
  }

  return tool({
    get description() {
      if (cachedDescription === null) {
        void buildDescription()
      }
      return cachedDescription ?? TOOL_DESCRIPTION_PREFIX
    },
    args: {
      name: tool.schema.string().describe("The command name (e.g., 'start-work' or 'init-deep'). Use without leading slash for commands."),
    },
    async execute(args: any) {
      const commands = getCommands()
      cachedDescription = buildDescription(true)

      const requestedName = args.name.replace(/^\//, "")
      
      const matchedCommand = commands.find((cmd) => cmd.name === requestedName)

      if (matchedCommand) {
        const output: string[] = [
          `## Command: /${matchedCommand.name}`,
          "",
          matchedCommand.metadata.description || "",
          "",
          "Template:",
          "```",
          matchedCommand.content,
          "```",
        ]
        
        if (matchedCommand.metadata.argumentHint) {
          output.push("", `**Usage**: /${matchedCommand.name} ${matchedCommand.metadata.argumentHint}`)
        }
        
        return output.join("\n")
      }

      const available = commands.map((cmd) => `/${cmd.name}`).join(", ")
      throw new Error(
        `Command "${args.name}" not found. Available: ${available || "none"}`
      )
    },
  })
}
