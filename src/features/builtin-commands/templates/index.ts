export const INIT_DEEP_TEMPLATE = `(builtin) Initialize hierarchical AGENTS.md knowledge base`;

export const RALPH_LOOP_TEMPLATE = `(builtin) Start self-referential development loop until completion`;

export const ULW_LOOP_TEMPLATE = `(builtin) Start ultrawork loop - continues until completion with ultrawork mode`;

export const CANCEL_RALPH_TEMPLATE = `(builtin) Cancel active Ralph Loop`;

export const REFACTOR_TEMPLATE = `(builtin) Intelligent refactoring command with LSP, AST-grep, architecture analysis, and TDD verification.`;

export const START_WORK_TEMPLATE = `(builtin) Start Sisyphus work session from Prometheus plan`;

export const STOP_CONTINUATION_TEMPLATE = `(builtin) Stop all continuation mechanisms (ralph loop, todo continuation, boulder) for this session`;

export const REMOVE_AI_SLOPS_TEMPLATE = `(builtin) Remove AI-generated code smells from branch changes and critically review the results`;

export const HANDOFF_TEMPLATE = `(builtin) Create a detailed context summary for continuing work in a new session`;

export const START_PLANNING_TEMPLATE = `You are Prometheus, the Planner agent. Your role is to help users plan new projects from scratch.

If the user has NOT provided a project description (user-request is empty), ask them to describe their project idea, what they want to build, and any requirements they have.

If the user HAS provided a project description, start the planning interview:
1. Ask clarifying questions about the project to understand requirements
2. Create a detailed work plan with task breakdowns
3. Save the plan when complete

Begin by checking if the user has provided a project description. If not, prompt them for one.`;

export const FINISH_INTERVIEW_TEMPLATE = `You are Prometheus, the Planner agent. You are finishing the planning interview.

1. Present the final plan summary to the user
2. Ask if they're happy with the plan or want changes
3. Once the user confirms the plan is complete, save the plan to a file:
   - Location: .prometheus/project-plan.md
   - Use the write tool to create this file with the complete plan content
4. Tell the user the plan has been saved and they should:
   - Start a new session
   - Switch to the Atlas agent
   - Type /execute-plan to begin implementation`;

export const EXECUTE_PLAN_TEMPLATE = `Read the project plan from: .prometheus/project-plan.md

If the plan file doesn't exist, tell the user to run /start-planning first with the Prometheus agent.

If the plan exists, create a todo list with wave assignments, then delegate tasks using the task tool. Use run_in_background=true for all delegations.

Delegate to:
- @sisyphus-junior for simple tasks like file creation
- @sisyphus for backend/core logic
- @athena for UI/frontend work
- @validator after each builder task to verify work

Do NOT write code yourself - only delegate and track progress.`;