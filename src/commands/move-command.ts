'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.location.move';

export type MoveData = {
  gameState: GameState,
  direction: string
};

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class MoveCommand implements Command {

  /**
   * Creates an instance of ConjureItemCommand.
   *
   * @param {string} sessionToken - string identifying the current game session
   * @param {String} direction - n|s|e|w|u|d
   *
   * @memberOf ConjureItemCommand
   */
  constructor(gameState: GameState, direction: string) {
    this.topic = topic;
    this.data = { gameState, direction };
  }

  public topic: string;
  public data: MoveData;

  static get topic() {
    return topic;
  }
}

