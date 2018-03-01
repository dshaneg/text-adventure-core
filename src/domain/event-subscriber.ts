export interface EventSubscriber {
  handle(event: any): void;
}