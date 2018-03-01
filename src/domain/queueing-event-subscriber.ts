import { EventSubscriber } from './event-subscriber';

export class QueueingEventSubscriber implements EventSubscriber {
  public events = new Array<any>();

  handle(event: any): void {
    this.events.push(event);
  }
}