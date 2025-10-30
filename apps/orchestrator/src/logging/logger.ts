import pino, { type DestinationStream, type LoggerOptions } from 'pino';

const redactDefaults = ['headers.authorization', 'payload.token', 'payload.secret'];

const baseOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  redact: {
    paths: redactDefaults,
    censor: '[REDACTED]',
  },
};

export type OrchestratorLog = {
  task: string;
  turn: number;
  role: string;
  type: string;
  status: 'propose' | 'critique' | 'implement' | 'verify' | 'error';
  message?: string;
};

export function createLogger(options: LoggerOptions = {}, destination?: DestinationStream) {
  return pino({ ...baseOptions, ...options }, destination);
}

export const logger = createLogger();

export function logTurn(entry: OrchestratorLog) {
  if (entry.status === 'error') {
    logger.error(entry, 'turn');
  } else {
    logger.info(entry, 'turn');
  }
}
