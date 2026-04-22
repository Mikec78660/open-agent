export interface BackgroundTask {
    id: string;
    sessionID?: string;
    parentSessionID: string;
    description: string;
    prompt: string;
    agent: string;
    requestedAgent: string;
    model?: {
        providerID: string;
        modelID: string;
        llamaModelID: string;
        slotId: number;
    };
    status: "pending" | "running" | "completed" | "error" | "cancelled" | "queued";
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
export interface LaunchInput {
    description: string;
    prompt: string;
    agent: string;
    parentSessionID: string;
    load_skills?: string[];
}
export interface DelegateTaskArgs {
    description?: string;
    prompt: string;
    subagent_type: string;
    run_in_background: boolean;
    load_skills?: string[];
}
//# sourceMappingURL=types.d.ts.map