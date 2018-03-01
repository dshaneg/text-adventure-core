import { EventSubscriber } from './event-subscriber';

export interface EventPublisher {
  publish (event: any): void;
}

export class Publisher implements EventPublisher {
  constructor(private subscribers: EventSubscriber[]) {}

  publish(event: any): void {
    this.subscribers.forEach(subscriber => {
      subscriber.handle(event);
    });
  }
}
