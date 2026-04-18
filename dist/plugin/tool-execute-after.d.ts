import type { PluginContext } from "../plugin/types";
import type { CreatedHooks } from "../create-hooks";
export declare function createToolExecuteAfterHandler(args: {
    ctx: PluginContext;
    hooks: CreatedHooks;
}): (input: unknown, output: unknown) => Promise<void>;
//# sourceMappingURL=tool-execute-after.d.ts.map