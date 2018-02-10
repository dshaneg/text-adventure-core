'use strict';

import { Command, AddEventCall } from './command';
import { GameState } from '../game-state';

/** Class representing a command instructing the game to add a list of item deltas to inventory.
 * Item deltas consist of an item and a count.
 */
export class AddInventoryCommand implements Command {

  /**
   * Creates an instance of AddInventoryCommand.
   *
   * @param {Array<{item: any, count: number}>} deltas
   *
   * @memberOf AddInventoryCommand
   */
  constructor(deltas: Array<{ item: any, count: number }>) {
    this.deltas = deltas;
  }

  private deltas: Array<{ item: any, count: number }>;

  /**
   * Adds an item delta (item and acount) to the command.
   *
   * @param {any} item - the item to add to inventory
   * @param {any} count - the quantity of item you wish to add
   *
   * @memberOf AddInventoryCommand
   */
  addDelta(item: any, count: number) {
    this.deltas.push({ item, count });
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    for (const delta of this.deltas) {
      gameState.addInventory(delta.item, delta.count);
      addEvent({ topic: 'player.inventory.added', item: delta.item, count: delta.count });
    }
  }
}
