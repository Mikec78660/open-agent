import type { PluginContext } from "../plugin/types";
import type { CreatedHooks } from "../create-hooks";
export declare function createToolExecuteBeforeHandler(args: {
    ctx: PluginContext;
    hooks: CreatedHooks;
}): (input: unknown, output: unknown) => Promise<void>;
//# sourceMappingURL=tool-execute-before.d.ts.map