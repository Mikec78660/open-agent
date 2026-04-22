// task-queue.ts
//  Task queue management with fallback routing
//  Queues overflow tasks when all agent slots are busy
//  Routes queued tasks when slots become available
//  Sends "All agents idle" notification when all slots go idle
//  
//  Created on: Wed Apr 22 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

import type { BackgroundTask } from "./types";
import {
  getIdleInstance,
  getFallbackInstance,
  anyAgentBusy,
  type AgentInstance,
} from "./llama-slot";

const MAX_QUEUE_SIZE = 50;

interface QueuedTask {
  task: BackgroundTask;
  requestedAgent: string;
  instance?: AgentInstance;
  queuedAt: Date;
}

type AllIdleCallback = () => void;

let instance: {
  queue: QueuedTask[];
  busyCount: number;
  wasBusy: boolean;
  onAllIdle: AllIdleCallback | null;
  pollingInterval: ReturnType<typeof setInterval> | null;
} = {
  queue: [],
  busyCount: 0,
  wasBusy: false,
  onAllIdle: null,
  pollingInterval: null,
};

export function initQueue(
  _onIdleCallback: (agentType: string) => void,
  onAllIdleCallback: AllIdleCallback
): void {
  instance.onAllIdle = onAllIdleCallback;
}

export function enqueue(task: BackgroundTask, requestedAgent: string): {
  success: boolean;
  instance?: AgentInstance;
  message: string;
} {
  if (instance.queue.length >= MAX_QUEUE_SIZE) {
    return {
      success: false,
      message: `Queue full (${MAX_QUEUE_SIZE} max). Task not queued.`,
    };
  }

  instance.queue.push({
    task,
    requestedAgent,
    queuedAt: new Date(),
  });

  return {
    success: true,
    message: `Task queued (${instance.queue.length} in queue)`,
  };
}

export function startPolling(processTask: (task: QueuedTask, instance: AgentInstance) => Promise<void>): void {
  if (instance.pollingInterval) return;

  instance.pollingInterval = setInterval(async () => {
    await processQueue(processTask);
  }, 10000);
}

export function stopPolling(): void {
  if (instance.pollingInterval) {
    clearInterval(instance.pollingInterval);
    instance.pollingInterval = null;
  }
}

async function processQueue(processTask: (task: QueuedTask, instance: AgentInstance) => Promise<void>): Promise<void> {
  const busy = await anyAgentBusy();

  if (busy) {
    instance.wasBusy = true;
  } else if (instance.wasBusy) {
    instance.wasBusy = false;
    instance.onAllIdle?.();
  }

  if (instance.queue.length === 0) return;

  const task = instance.queue[0];

  let inst = await getIdleInstance(task.requestedAgent);
  if (!inst) {
    inst = await getFallbackInstance(task.requestedAgent);
  }

  if (inst) {
    instance.queue.shift();
    instance.busyCount++;
    await processTask(task, inst);

    if (instance.busyCount === 1) {
      instance.wasBusy = true;
    }
  }
}

export function markSlotBusy(_agentType: string): void {
  instance.busyCount++;
  instance.wasBusy = true;
}

export function markSlotIdle(_agentType: string): void {
  instance.busyCount = Math.max(0, instance.busyCount - 1);

  if (instance.busyCount === 0) {
    instance.wasBusy = false;
    instance.onAllIdle?.();
  }
}

export function getQueueLength(): number {
  return instance.queue.length;
}

export function getBusyCount(): number {
  return instance.busyCount;
}