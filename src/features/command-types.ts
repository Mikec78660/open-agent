export interface CommandDefinition {
  name: string;
  description: string;
  template: string;
  argumentHint?: string;
  agent?: string;
}