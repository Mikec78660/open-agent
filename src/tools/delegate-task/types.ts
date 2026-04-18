export interface DelegateTaskArgs {
  load_skills: string[];
  description?: string;
  prompt: string;
  run_in_background: boolean;
  agent?: string;
  session_id?: string;
  command?: string;
}

export interface DelegateTaskToolOptions {
  gitMasterConfig?: any;
  browserProvider?: any;
  disabledSkills?: string[];
  directory: string;
  availableAgents?: any[];
  availableSkills?: any[];
  userCategories?: Record<string, any>;
}

export interface BuildSystemContentInput {
  skillContent?: string;
  skillContents?: string[];
  categoryPromptAppend?: string;
  agentName: string;
  maxPromptTokens?: number;
  model?: any;
  availableCategories?: any[];
  availableSkills?: any[];
}