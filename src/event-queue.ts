import { EventPublisher } from './domain/event-publisher';

export class EventQueue implements EventPublisher {
  public events = new Array<any>();

  publish(event: any): void {
    this.events.push(event);
  }
}