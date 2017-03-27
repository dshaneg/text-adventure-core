'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.inventory.equip-item';

export type EquipItemData = {
  gameState: GameState,
  item: any
};

/** Class representing a command instructing the game equip an item on the player.
 */
export class EquipItemCommand implements Command {

  /**
   * Create an instance of StartCommand.
   */
  constructor(gameState: GameState, item: any) {
    this.topic = topic;
    this.data = { gameState, item };
  }

  public topic: string;
  public data: EquipItemData;

  static get topic() {
    return topic;
  }
}
