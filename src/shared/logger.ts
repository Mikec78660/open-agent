export function log(message: string, data?: any): void {
  console.log(`[Open-Agent] ${message}`, data ?? "");
}