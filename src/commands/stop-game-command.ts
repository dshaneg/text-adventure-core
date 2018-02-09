'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

/** Class representing a command instructing the game to stop.
 */
export class StopGameCommand implements Command {

  /**
   * Create an instance of StopGameCommand.
   */
  constructor() {
  }

  execute(gameState: GameState): void {
    gameState.stop();
  }
}

