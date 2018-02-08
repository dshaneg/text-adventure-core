'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.inventory.equip-item';

/** Class representing a command instructing the game equip an item on the player.
 */
export class EquipItemCommand implements Command {

  /**
   * Create an instance of EquipItemCommand.
   */
  constructor(item: any) {
    this.item = item;
  }

  private item: any;

  execute(gameState: GameState): void {
    gameState.player.inventory.equip(this.item);
  }
}
