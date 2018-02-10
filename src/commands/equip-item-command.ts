'use strict';

import { Command, AddEventCall } from './command';
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

  execute(gameState: GameState, addEvent: AddEventCall): void {
    gameState.equip(this.item);

    addEvent({ topic: 'player.inventory.item-equipped', item: this.item });
  }
}
