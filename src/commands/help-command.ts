'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'game.help';

export type HelpData = {
  gameState: GameState
};

/**
 * Class representing a command instructing the provide help text.
 */
export class HelpCommand implements Command {
  /**
   * Create an instance of StartCommand.
   */
  constructor(gameState: GameState) {
    this.topic = topic;
    this.data = { gameState };
  }

  public topic: string;
  public data: HelpData;

  static get topic() {
    return topic;
  }
}
