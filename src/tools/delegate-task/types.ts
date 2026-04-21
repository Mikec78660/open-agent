// types.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Tue Apr 21 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

export interface BackgroundTask {
  id: string
  sessionID?: string
  parentSessionID: string
  description: string
  prompt: string
  agent: string
  status: "pending" | "running" | "completed" | "error" | "cancelled"
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  error?: string
}

export interface LaunchInput {
  description: string
  prompt: string
  agent: string
  parentSessionID: string
  load_skills?: string[]
}

export interface DelegateTaskArgs {
  description?: string
  prompt: string
  subagent_type: string
  run_in_background: boolean
  load_skills?: string[]
}