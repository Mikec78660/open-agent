import { z } from "zod";
export declare const OpenAgentConfigSchema: z.ZodObject<{
    disabled_agents: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        sisyphus: "sisyphus";
        atlas: "atlas";
        explorer: "explorer";
        librarian: "librarian";
        prometheus: "prometheus";
        oracle: "oracle";
        designer: "designer";
        "sisyphus-junior": "sisyphus-junior";
        validator: "validator";
        hephaestus: "hephaestus";
        athena: "athena";
        metis: "metis";
        momus: "momus";
    }>>>;
    agent_overrides: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    prompt_append: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    categories: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    agents: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<{
            primary: "primary";
            subagent: "subagent";
        }>>;
        instances: z.ZodArray<z.ZodObject<{
            model: z.ZodString;
            fallback: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type OpenAgentConfig = z.infer<typeof OpenAgentConfigSchema>;
//# sourceMappingURL=open-agent-config.d.ts.map