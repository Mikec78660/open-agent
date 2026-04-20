// commands.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0
import type { CommandDefinition } from "../command-types";
import type { BuiltinCommandName, BuiltinCommands } from "./types";

export type { BuiltinCommands };
import {
  INIT_DEEP_TEMPLATE,
  RALPH_LOOP_TEMPLATE,
  ULW_LOOP_TEMPLATE,
  CANCEL_RALPH_TEMPLATE,
  REFACTOR_TEMPLATE,
  START_WORK_TEMPLATE,
  STOP_CONTINUATION_TEMPLATE,
  REMOVE_AI_SLOPS_TEMPLATE,
  HANDOFF_TEMPLATE,
  START_PLANNING_TEMPLATE,
  FINISH_INTERVIEW_TEMPLATE,
  EXECUTE_PLAN_TEMPLATE,
} from "./templates";

export function loadBuiltinCommands(): BuiltinCommands {
   return {
     "init-deep": {
       name: "init-deep",
       description: "(builtin) Initialize hierarchical AGENTS.md knowledge base",
       template: `<command-instruction>
 ${INIT_DEEP_TEMPLATE}
 </command-instruction>

 <user-request>
 $ARGUMENTS
 </user-request>`,
       argumentHint: "[--create-new] [--max-depth=N]",
     },
      "ralph-loop": {
        name: "ralph-loop",
       description: "(builtin) Start self-referential development loop until completion",
       template: `<command-instruction>
 ${RALPH_LOOP_TEMPLATE}
 </command-instruction>
 
 <user-task>
 $ARGUMENTS
 </user-task>`,
       argumentHint: '"task description" [--completion-promise=TEXT] [--max-iterations=N]',
     },
     "ulw-loop": {
       name: "ulw-loop",
       description: "(builtin) Start ultrawork loop - continues until completion with ultrawork mode",
       template: `<command-instruction>
 ${ULW_LOOP_TEMPLATE}
 </command-instruction>
 
 <user-task>
 $ARGUMENTS
 </user-task>`,
       argumentHint: '"task description" [--completion-promise=TEXT]',
     },
     "cancel-ralph": {
       name: "cancel-ralph",
       description: "(builtin) Cancel active Ralph Loop",
       template: `<command-instruction>
 ${CANCEL_RALPH_TEMPLATE}
 </command-instruction>`,
     },
     "refactor": {
       name: "refactor",
       description: "(builtin) Intelligent refactoring command with LSP, AST-grep, and TDD verification.",
       template: `<command-instruction>
 ${REFACTOR_TEMPLATE}
 </command-instruction>`,
       argumentHint: "<refactoring-target> [--scope=<file|module|project>]",
     },
    "start-work": {
         name: "start-work",
        description: "(builtin) Start Sisyphus work session from Prometheus plan",
        template: `<command-instruction>
 ${START_WORK_TEMPLATE}
 </command-instruction>
 
 <session-context>
 Session ID: $SESSION_ID
 Timestamp: $TIMESTAMP
 </session-context>
 
 <user-request>
 $ARGUMENTS
 </user-request>`,
        argumentHint: "[plan-name]",
      },
     "stop-continuation": {
       name: "stop-continuation",
       description: "(builtin) Stop all continuation mechanisms for this session",
       template: `<command-instruction>
 ${STOP_CONTINUATION_TEMPLATE}
 </command-instruction>`,
     },
     "remove-ai-slops": {
       name: "remove-ai-slops",
       description: "(builtin) Remove AI-generated code smells from branch changes",
       template: `<command-instruction>
 ${REMOVE_AI_SLOPS_TEMPLATE}
 </command-instruction>
 
 <user-request>
 $ARGUMENTS
 </user-request>`,
     },
     "handoff": {
       name: "handoff",
       description: "(builtin) Create a detailed context summary for continuing work in a new session",
       template: `<command-instruction>
 ${HANDOFF_TEMPLATE}
 </command-instruction>
 
 <session-context>
 Session ID: $SESSION_ID
 Timestamp: $TIMESTAMP
 </session-context>
 
 <user-request>
 $ARGUMENTS
 </user-request>`,
       argumentHint: "[goal]",
     },
     "start-planning": {
         name: "start-planning",
        description: "(builtin) Start Prometheus planning interview for new project",
        template: `<command-instruction>
 ${START_PLANNING_TEMPLATE}
 </command-instruction>
 
 <user-request>
 $ARGUMENTS
 </user-request>`,
        argumentHint: "[project-name]",
      },
  "finish-interview": {
         name: "finish-interview",
        description: "(builtin) Complete Prometheus interview and transfer to Atlas coordinator",
        template: `<command-instruction>
  ${FINISH_INTERVIEW_TEMPLATE}
  </command-instruction>
  
  <user-request>
  $ARGUMENTS
  </user-request>`,
      },
      "execute-plan": {
        name: "execute-plan",
        description: "(builtin) Execute Prometheus plan as Atlas agent",
        template: `<command-instruction>
  ${EXECUTE_PLAN_TEMPLATE}
  </command-instruction>`,
      },
    };
  }