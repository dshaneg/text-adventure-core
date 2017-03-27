'use strict';

import { Command } from './command';
import { GameState } from '../game-state';


const topic = 'game.stop';

export type StopGameData = { gameState: GameState, force: boolean };

/** Class representing a command instructing the game to stop.
 */
export class StopGameCommand implements Command {

  /**
   * Create an instance of StopGameCommand.
   */
  constructor(gameState: GameState, force?: boolean) {
    this.topic = topic;
    this.data = { gameState, force };
  }

  public topic: string;
  public data: StopGameData;

  static get topic() {
    return topic;
  }
}

