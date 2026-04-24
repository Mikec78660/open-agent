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
    handleEvent(event: any): void;
    findBySession(sessionID: string): BackgroundTask | undefined;
    private processQueue;
    getTask(id: string): BackgroundTask | undefined;
    getAllTasks(): BackgroundTask[];
    getRunningTasks(): BackgroundTask[];
    getQueuedTasks(): BackgroundTask[];
    private sendTaskCompletionNotification;
}
//# sourceMappingURL=manager.d.ts.map