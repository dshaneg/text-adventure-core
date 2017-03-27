'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'game.start';

export type StartGameData = {
  gameState: GameState
}

/**
 * Class representing a command instructing the game to initialize and start.
 */
export class StartGameCommand implements Command {
  constructor(gameState: GameState) {
    this.topic = topic;
    this.data = { gameState };
  }

  public topic: string;
  public data: StartGameData;

  static get topic() {
    return topic;
  }
}

