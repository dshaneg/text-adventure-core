'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'item.conjure';

export type ConjureItemData = {
  gameState: GameState,
  itemId: number,
  count: number
};

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class ConjureItemCommand implements Command {

  constructor(gameState: GameState, itemId: number, count: number) {
    this.topic = topic;
    this.data = {
      gameState,
      itemId,
      count
    };
  }

  public topic: string;
  public data: ConjureItemData;

  static get topic() {
    return topic;
  }
}
