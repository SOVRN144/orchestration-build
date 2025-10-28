import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { ErrorObject } from 'ajv';
import schema from './message.schema.json' with { type: 'json' };

// NOTE: Phase1Message must stay in sync with message.schema.json. If fields change,
// update both the schema and this type (or adopt schema-to-type generation).

export type Phase1Message = {
  role: 'architect' | 'builder';
  type: 'propose' | 'critique' | 'implement' | 'verify';
  content: string;
  turn: number;
  reasons?: string[];
  evidence?: string[];
  risks?: string[];
  budgetTrace?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    schemaVersion?: string;
    status?: 'stubbed';
  };
};

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile<Phase1Message>(schema);

export class ValidationError extends Error {
  constructor(public errors: ErrorObject[]) {
    super('MESSAGE_SCHEMA_VALIDATION_FAILED');
    this.name = 'ValidationError';
  }
}

export function validateMessage(data: unknown): boolean {
  return validate(data);
}

export function assertValidMessage(data: unknown): void {
  if (!validate(data)) {
    throw new ValidationError(validate.errors ?? []);
  }
}
