'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ReadOnlyGameState } from '../state/game-state';

/** Class representing a command instructing the game to stop.
 */
export class StopGameCommand implements Command {

  /**
   * Create an instance of StopGameCommand.
   */
  constructor(private force: boolean) {
  }

  execute(gameState: ReadOnlyGameState, publisher: EventPublisher): void {
    if (this.force) {
      publisher.publish({
        topic: 'game.stopped',
        message: 'See you next time.',
        voice: Voice.gamemaster
      });
    } else {
      publisher.publish({
        topic: 'game.stop-requested'
      });
    }
  }
}

