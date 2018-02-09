'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

/**
 * Class representing a command instructing the provide help text.
 */
export class HelpCommand implements Command {
  /**
   * Create an instance of StartCommand.
   */
  constructor() {
  }

  execute(gameState: GameState): void {
    gameState.queryHelp();
  }
}
