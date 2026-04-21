import type { PluginContext } from "../../plugin/types";
import type { BackgroundTask, LaunchInput } from "./types";
export declare class SimpleBackgroundManager {
    private tasks;
    private client;
    private directory;
    constructor(ctx: PluginContext);
    launch(input: LaunchInput): Promise<BackgroundTask>;
    private startTask;
    getTask(id: string): BackgroundTask | undefined;
    getAllTasks(): BackgroundTask[];
}
//# sourceMappingURL=manager.d.ts.map