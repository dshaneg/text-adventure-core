'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../game-state';

/** Class representing a command instructing the game to stop.
 */
export class StopGameCommand implements Command {

  /**
   * Create an instance of StopGameCommand.
   */
  constructor(private force: boolean) {
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    if (this.force) {
      gameState.stop();
      addEvent({
        topic: 'game.stopped',
        message: 'See you next time.',
        voice: Voice.gamemaster,
        sessionToken: gameState.sessionToken,
      });
    } else {
      addEvent({
        topic: 'game.stop-requested',
        sessionToken: gameState.sessionToken
      });
    }
  }
}

