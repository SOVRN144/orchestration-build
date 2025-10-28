export type MessageType = 'propose' | 'critique' | 'implement' | 'verify';
export type Role = 'architect' | 'builder';

export interface Message {
  role: Role;
  type: MessageType;
  content: string;
  turn: number;
}

export interface DebateResult {
  status: 'CONVERGED' | 'FAILED';
  turns: number;
  diff?: string;
  log: Message[];
  reason?: 'NO_IMPROVEMENT' | 'MAX_TURNS';
}
