'use strict';

import { EventSubscriber } from './event-subscriber';
import { GameState } from '../state/game-state';
import { StateChangeHandler } from './state-change-handler/state-change-handler';

export class GameStateEventSubscriber implements EventSubscriber {
  constructor(private gameState: GameState, private handlers: StateChangeHandler[]) {}

  handle(event: any): void {
    const handler = this.handlers.find(element => element.handles(event));

    if (handler) {
      handler.handle(event, this.gameState);
    }
  }
}
