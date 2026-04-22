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
  private pendingNotifications: string[] = [];

  constructor(ctx: PluginContext) {
    this.client = ctx.client;
    this.directory = ctx.directory;
    this.mainSessionID = (ctx as any).sessionID || "main";

    initQueue(
      (_agentType: string) => {},
      () => {
        this.queueAllIdleNotification();
      }
    );
  }

  getPendingNotifications(): string[] {
    return [...this.pendingNotifications];
  }

  clearPendingNotifications(): void {
    this.pendingNotifications = [];
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
        console.error("[manager] startTask error:", err);
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
          console.error("[manager] startTask error:", err);
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

    await this.client.session.promptAsync({
      path: { id: sessionID },
      body: {
        agent: task.requestedAgent,
        model: task.model ? {
          providerID: task.model.providerID,
          modelID: task.model.modelID,
        } : undefined,
        parts: [{ type: "text", text: task.prompt }],
      },
    });

    this.startPolling();
  }

  private startPolling(): void {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(() => {
      this.pollTasks().catch(() => {});
    }, 10000);
  }

  private async pollTasks(): Promise<void> {
    const { isSlotBusy } = await import("./llama-slot");

    for (const task of this.tasks.values()) {
      if (task.status !== "running" || !task.sessionID || !task.model) continue;

      try {
        const busy = await isSlotBusy(task.model.providerID, task.model.llamaModelID, task.model.slotId);

        if (!busy) {
          task.status = "completed";
          task.completedAt = new Date();
          const agentType = task.requestedAgent;
          markSlotIdle(agentType);
          this.processQueue();
        }
      } catch (_err) {
      }
    }

    const activeTasks = Array.from(this.tasks.values()).filter(
      (t) => t.status === "running"
    );
    if (activeTasks.length === 0) {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    }
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

      this.startTask(task).catch((err) => {
        console.error("[manager] startTask error:", err);
        task.status = "error";
        task.error = err instanceof Error ? err.message : String(err);
        task.completedAt = new Date();
        markSlotIdle(idleInstance!.agentType);
      });
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

  private queueAllIdleNotification(): void {
    if (this.notificationPending) return;
    this.notificationPending = true;

    const notification = `<system-reminder>
[ALL AGENTS IDLE]
All delegated builder tasks have completed. You may now delegate the validator task for this wave.
</system-reminder>`;

    this.pendingNotifications.push(notification);
    this.notificationPending = false;
  }
}