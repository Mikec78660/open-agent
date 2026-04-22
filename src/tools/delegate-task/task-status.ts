// task-status.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Tue Apr 21 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import { tool, type ToolDefinition } from "@opencode-ai/plugin";
import { SimpleBackgroundManager } from "./manager";

export function createTaskStatusTool(manager: SimpleBackgroundManager): ToolDefinition {
  const description = `Check the status of a background task.

Use this to check if a delegated task has completed, is running, or failed.

Parameters:
- task_id: The ID returned when you launched the background task (format: bg_xxxxxxxx)`;

  return tool({
    description,
    args: {
      task_id: tool.schema.string().describe("Task ID to check (format: bg_xxxxxxxx)"),
    },
    async execute(args: Record<string, unknown>) {
      const taskId = args.task_id as string;
      
      if (!taskId) {
        return "Error: task_id is required";
      }

      const task = manager.getTask(taskId);
      
      if (!task) {
        return `Task not found: ${taskId}`;
      }

      let statusMsg = `Task ID: ${task.id}
Requested: ${task.requestedAgent}
Assigned: ${task.agent}
Status: ${task.status}
Description: ${task.description}
Created: ${task.createdAt.toISOString()}`;

if (task.model) {
  statusMsg += `\nModel: ${task.model.providerID}/${task.model.modelID} (slot ${task.model.slotId})`;
}

statusMsg += `
${task.startedAt ? `Started: ${task.startedAt.toISOString()}` : ""}
${task.completedAt ? `Completed: ${task.completedAt.toISOString()}` : ""}
${task.error ? `Error: ${task.error}` : ""}
${task.sessionID ? `Session: ${task.sessionID}` : ""}`;

return statusMsg;
    },
  });
}