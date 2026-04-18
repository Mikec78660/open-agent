import { z } from "zod";
export declare const AgentNameSchema: z.ZodEnum<{
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
}>;
export type AgentName = z.infer<typeof AgentNameSchema>;
export declare const DisabledAgentsSchema: z.ZodOptional<z.ZodArray<z.ZodEnum<{
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
}>>>;
export declare const AgentOverrideSchema: z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    prompt_append: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type AgentOverrideConfig = z.infer<typeof AgentOverrideSchema>;
export declare const AgentOverridesSchema: z.ZodRecord<z.ZodEnum<{
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
}>, z.ZodObject<{
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
    prompt_append: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type AgentOverrides = z.infer<typeof AgentOverridesSchema>;
//# sourceMappingURL=agent-names.d.ts.map