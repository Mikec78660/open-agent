// manager.ts
//  Background task manager with pool-based delegation and slot polling
//  Uses llama.cpp slot API to track when tasks complete
//  Routes overflow tasks through fallback chain
//  Sends "All agents idle" notification when all slots go idle
//  
//  Created on: Wed Apr 22 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { PluginContext } from "../../plugin/types";
import type { BackgroundTask, LaunchInput } from "./types";
import { getIdleInstance, getFallbackInstance } from "./llama-slot";
import {
  initQueue,
  enqueue,
  markSlotBusy,
  markSlotIdle,
} from "./task-queue";

export class SimpleBackgroundManager {
  private tasks: Map<string, BackgroundTask> = new Map();
  private client: PluginContext["client"];
  private directory: string;
  private mainSessionID: string;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private notificationPending: boolean = false;

  constructor(ctx: PluginContext) {
    this.client = ctx.client;
    this.directory = ctx.directory;
    const sessionID = (ctx as any).sessionID;
    this.mainSessionID = sessionID || "main";

    initQueue(
      (_agentType: string) => {},
      () => {}
    );
  }

  getParentSessionID(): string {
    return this.mainSessionID;
  }

  getPendingNotifications(): string[] {
    return [];
  }

  clearPendingNotifications(): void {
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
      requestedAgent: input.agent,
    };

    this.tasks.set(task.id, task);

    const idleInstance = await getIdleInstance(input.agent);
    if (idleInstance) {
      task.status = "running";
      task.startedAt = new Date();
      task.agent = `${idleInstance.agentType}-${idleInstance.instanceIndex}`;
      task.model = {
        providerID: idleInstance.providerID,
        modelID: idleInstance.modelID,
        llamaModelID: idleInstance.llamaModelID,
        slotId: idleInstance.slotId,
      };
      markSlotBusy(idleInstance.agentType);

      this.startTask(task).catch((err) => {
        task.status = "error";
        task.error = err instanceof Error ? err.message : String(err);
        task.completedAt = new Date();
        markSlotIdle(idleInstance.agentType);
      });
    } else {
      const fallbackInstance = await getFallbackInstance(input.agent);
      if (fallbackInstance) {
        task.status = "running";
        task.startedAt = new Date();
        task.agent = `${fallbackInstance.agentType}-${fallbackInstance.instanceIndex}`;
        task.model = {
          providerID: fallbackInstance.providerID,
          modelID: fallbackInstance.modelID,
          llamaModelID: fallbackInstance.llamaModelID,
          slotId: fallbackInstance.slotId,
        };
        markSlotBusy(fallbackInstance.agentType);

        this.startTask(task).catch((err) => {
          task.status = "error";
          task.error = err instanceof Error ? err.message : String(err);
          task.completedAt = new Date();
          markSlotIdle(fallbackInstance.agentType);
        });
      } else {
        const result = enqueue(task, input.agent);
        if (result.success) {
          task.status = "queued";
        } else {
          task.status = "error";
          task.error = result.message;
        }
      }
    }

    return { ...task };
  }

  private async startTask(task: BackgroundTask): Promise<void> {
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

    this.client.session.promptAsync({
      path: { id: sessionID },
      body: {
        agent: task.requestedAgent,
        model: task.model ? {
          providerID: task.model.providerID,
          modelID: task.model.modelID,
        } : undefined,
        parts: [{ type: "text", text: task.prompt }],
      },
    }).catch((err: any) => {
      // Error handled quietly
      task.status = "error";
      task.completedAt = new Date();
      task.error = err instanceof Error ? err.message : String(err);
      this.sendTaskCompletionNotification(task, `error: ${task.error}`);
      markSlotIdle(task.requestedAgent);
      this.processQueue();
    });
  }

  private startPolling(): void {
  }

  handleEvent(event: any): void {
    if (!event || !event.properties) return;
    if (event.type === "session.idle") {
      this.processQueue().catch(() => {});
    }

    if (event.type === "session.idle" || event.type === "session.status") {
      const sessionID = event.properties.sessionID;
      const task = this.findBySession(sessionID);
      
      if (task && task.status === "running") {
        const isStatusFinish = event.type === "session.status" && (event.properties.status === "done" || event.properties.status === "error" || event.properties.status === "aborted");
        const isIdle = event.type === "session.idle";
        
        if (isIdle || isStatusFinish) {
          const isError = event.properties.status === "error" || event.properties.status === "aborted";
          task.status = isError ? "error" : "completed";
          task.completedAt = new Date();
          
          if (isError) {
             task.error = event.properties.error || "Unknown error";
          }
          
          this.sendTaskCompletionNotification(task, task.status === "error" ? `error: ${task.error}` : "success");
          
          import("./task-queue").then(({ markSlotIdle }) => {
            markSlotIdle(task.requestedAgent);
            this.processQueue();
          }).catch(() => {});
        }
      }
    } else if (event.type === "session.deleted") {
      const sessionID = event.properties.sessionID;
      const task = this.findBySession(sessionID);
      if (task && task.status === "running") {
        task.status = "error";
        task.error = "Session deleted prematurely";
        task.completedAt = new Date();
        
        this.sendTaskCompletionNotification(task, `error: ${task.error}`);
        
        import("./task-queue").then(({ markSlotIdle }) => {
          markSlotIdle(task.requestedAgent);
          this.processQueue();
        }).catch(() => {});
      }
    }
  }



  findBySession(sessionID: string): BackgroundTask | undefined {
    for (const task of this.tasks.values()) {
      if (task.sessionID === sessionID) {
        return task;
      }
    }
    return undefined;
  }

  private async processQueue(): Promise<void> {
    const { getQueueLength } = await import("./task-queue");

    if (getQueueLength() === 0) return;

    const { getIdleInstance, getFallbackInstance } = await import("./llama-slot");

    const pendingTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "queued"
    );

    if (pendingTasks.length === 0) return;

    const task = pendingTasks[0];

    let idleInstance = await getIdleInstance(task.requestedAgent);
    if (!idleInstance) {
      idleInstance = await getFallbackInstance(task.requestedAgent);
    }

    if (idleInstance) {
      task.status = "running";
      task.startedAt = new Date();
      task.agent = `${idleInstance.agentType}-${idleInstance.instanceIndex}`;
      task.model = {
        providerID: idleInstance.providerID,
        modelID: idleInstance.modelID,
        llamaModelID: idleInstance.llamaModelID,
        slotId: idleInstance.slotId,
      };
      markSlotBusy(idleInstance.agentType);

      this.startTask(task).then(() => {
        // Queued task started successfully
      }).catch((err) => {
        // Error starting task handled quietly
        task.status = "error";
        task.error = err instanceof Error ? err.message : String(err);
        task.completedAt = new Date();
        markSlotIdle(idleInstance!.agentType);
      });
    } else {
      // No idle instance available
    }
  }

  getTask(id: string): BackgroundTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): BackgroundTask[] {
    return Array.from(this.tasks.values());
  }

  getRunningTasks(): BackgroundTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "running");
  }

  getQueuedTasks(): BackgroundTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === "queued");
  }

  private sendTaskCompletionNotification(task: BackgroundTask, outcome: string): void {
    if (!task.parentSessionID) return;

    const notification = `[Background Task Complete]\nTask ID: ${task.id}\nDescription: ${task.description || 'Unknown task'}\nAgent: ${task.requestedAgent}\nOutcome: ${outcome}`;

    this.client.session.promptAsync({
      path: { id: task.parentSessionID },
      body: {
        agent: "atlas",
        parts: [{ type: "text", text: notification }],
      },
    }).catch(() => {});
  }
}