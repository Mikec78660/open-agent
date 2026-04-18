// types.ts
//  [Descriptive explanation of what the code in the file does. List dependencies here.]
//  
//  Created on: Fri Apr 17 2026
//      Author: GPU-Server/Qwen3.6-35B-A3B-Q8_0

export interface CommandDefinition {
  name: string;
  description: string;
  template: string;
  argumentHint?: string;
  agent?: string;
}