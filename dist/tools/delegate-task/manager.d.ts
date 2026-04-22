import type { PluginContext } from "../../plugin/types";
import type { BackgroundTask, LaunchInput } from "./types";
export declare class SimpleBackgroundManager {
    private tasks;
    private client;
    private directory;
    private mainSessionID;
    private pollingInterval;
    private notificationPending;
    constructor(ctx: PluginContext);
    getParentSessionID(): string;
    getPendingNotifications(): string[];
    clearPendingNotifications(): void;
    launch(input: LaunchInput): Promise<BackgroundTask>;
    private startTask;
    private startPolling;
    private pollTasks;
    private processQueue;
    getTask(id: string): BackgroundTask | undefined;
    getAllTasks(): BackgroundTask[];
    getRunningTasks(): BackgroundTask[];
    getQueuedTasks(): BackgroundTask[];
    private sendAllIdleNotification;
}
//# sourceMappingURL=manager.d.ts.map