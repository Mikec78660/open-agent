import { z } from "zod";
export declare const BuiltinCommandNameSchema: z.ZodEnum<{
    "init-deep": "init-deep";
    "ralph-loop": "ralph-loop";
    "ulw-loop": "ulw-loop";
    "cancel-ralph": "cancel-ralph";
    refactor: "refactor";
    "start-work": "start-work";
    "stop-continuation": "stop-continuation";
    "remove-ai-slops": "remove-ai-slops";
    handoff: "handoff";
    "start-planning": "start-planning";
    "finish-interview": "finish-interview";
    "execute-plan": "execute-plan";
}>;
export type BuiltinCommandName = z.infer<typeof BuiltinCommandNameSchema>;
//# sourceMappingURL=commands.d.ts.map