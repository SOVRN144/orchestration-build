import crypto from 'node:crypto';
import type { Message } from '../schema/messages';

export interface Envelope<T> {
  seq: number;
  emittedAt: string;
  id: string;
  causationId?: string;
  correlationId?: string;
  payload: T;
}

export interface PublishOptions {
  causationId?: string;
  correlationId?: string;
}

export class InMemoryBus {
  private readonly capacity: number;
  private readonly envelopes: Envelope<Message>[] = [];
  private seq = 0;

  constructor(capacity = 200) {
    if (!Number.isFinite(capacity)) {
      throw new Error('Bus capacity must be a finite number');
    }
    const truncated = Math.trunc(capacity);
    if (truncated < 1 || truncated !== capacity) {
      throw new Error('Bus capacity must be a positive integer');
    }
    this.capacity = truncated;
  }

  publish(message: Message, options: PublishOptions = {}): Envelope<Message> {
    const envelope: Envelope<Message> = {
      seq: ++this.seq,
      emittedAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      causationId: options.causationId,
      correlationId: options.correlationId,
      payload: message,
    };
    this.envelopes.push(envelope);
    if (this.envelopes.length > this.capacity) {
      this.envelopes.shift();
    }
    return envelope;
  }

  history(): Message[] {
    return this.envelopes.map((env) => env.payload);
  }

  historyEnvelopes(): Envelope<Message>[] {
    return [...this.envelopes];
  }

  clear(): void {
    this.envelopes.length = 0;
    this.seq = 0;
  }
}
