import type { Message } from '../schema/messages';

export class InMemoryBus {
  private log: Message[] = [];
  publish(msg: Message) {
    this.log.push(msg);
  }
  history() {
    return [...this.log];
  }
}
