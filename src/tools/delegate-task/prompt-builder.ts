// prompt-builder.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

export function buildSystemContent(input: {
  skillContent?: string;
  skillContents?: string[];
  categoryPromptAppend?: string;
  agentName: string;
  maxPromptTokens?: number;
  model?: any;
  availableCategories?: any[];
  availableSkills?: any[];
}): string {
  const parts: string[] = [];
  
  if (input.skillContent) {
    parts.push(`## Skills\n${input.skillContent}\n`);
  }
  
  if (input.categoryPromptAppend) {
    parts.push(`## Context\n${input.categoryPromptAppend}\n`);
  }
  
  parts.push(`## Agent: ${input.agentName}`);
  
  return parts.join("\n\n");
}

export function buildTaskPrompt(prompt: string, agentName: string): string {
  return `[Task for ${agentName}]\n\n${prompt}`;
}