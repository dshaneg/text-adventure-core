'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.inventory.list';

export type ListInventoryData = {
  gameState: GameState
};

/**
 * Class representing a command instructing the game to provide the contents of the player's inventory.
 */
export class ListInventoryCommand implements Command {

  constructor(gameState: GameState) {
    this.topic = topic;
    this.data = { gameState };
  }

  public topic: string;
  public data: ListInventoryData;

  static get topic() {
    return topic;
  }
}
