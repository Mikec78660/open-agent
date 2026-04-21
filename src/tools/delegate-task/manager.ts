// manager.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Tue Apr 21 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { PluginContext } from "../../plugin/types";
import type { BackgroundTask, LaunchInput } from "./types";

export class SimpleBackgroundManager {
  private tasks: Map<string, BackgroundTask> = new Map();
  private client: PluginContext["client"];
  private directory: string;

  constructor(ctx: PluginContext) {
    this.client = ctx.client;
    this.directory = ctx.directory;
  }

  async launch(input: LaunchInput): Promise<BackgroundTask> {
    const task: BackgroundTask = {
      id: `bg_${crypto.randomUUID().slice(0, 8)}`,
      status: "pending",
      createdAt: new Date(),
      parentSessionID: input.parentSessionID,
      description: input.description,
      prompt: input.prompt,
      agent: input.agent,
    };

    this.tasks.set(task.id, task);

    // Launch async (fire and forget)
    this.startTask(task).catch((err) => {
      console.error("[simple-bg-manager] startTask error:", err);
      task.status = "error";
      task.error = err instanceof Error ? err.message : String(err);
      task.completedAt = new Date();
    });

    return { ...task };
  }

  private async startTask(task: BackgroundTask): Promise<void> {
    task.status = "running";
    task.startedAt = new Date();

    // Create child session
    const createResult = await this.client.session.create({
      body: {
        parentID: task.parentSessionID,
        title: `${task.description} (@${task.agent})`,
      },
      query: { directory: this.directory },
    });

    if (createResult.error || !createResult.data?.id) {
      throw new Error(`Failed to create session: ${createResult.error}`);
    }

    const sessionID = createResult.data.id;
    task.sessionID = sessionID;

    // Send prompt to the child session (runs async)
    await this.client.session.promptAsync({
      path: { id: sessionID },
      body: {
        agent: task.agent,
        parts: [{ type: "text", text: task.prompt }],
      },
    });

    // Task remains "running" - child session executes asynchronously
    // Status will be updated when session completes (not implemented yet)
  }

  getTask(id: string): BackgroundTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): BackgroundTask[] {
    return Array.from(this.tasks.values());
  }
}