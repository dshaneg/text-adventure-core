'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ItemFormatter } from './item-formatter';
import { GameState } from '../state/game-state';

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
  constructor(private deltas: Array<{ item: any, count: number }>, private silent: boolean = false) {
    deltas.forEach(delta => {
      this.validateItem(delta.item);
    });
  }

  /**
   * Adds an item delta (item and acount) to the command.
   *
   * @param {any} item - the item to add to inventory
   * @param {any} count - the quantity of item you wish to add
   *
   * @memberOf AddInventoryCommand
   */
  addDelta(item: any, count: number): void {
    this.validateItem(item);

    this.deltas.push({ item, count });
  }

  private validateItem(item: any): void {
    if (!item.id || !item.name) {
      throw new Error(`Bad item definition: ${JSON.stringify(item)}. Needs at least id and name.`);
    }
  }

  execute(gameState: GameState, publisher: EventPublisher): void {
    for (const delta of this.deltas) {
      gameState.addInventory(delta.item, delta.count);

      publisher.publish({
        topic: 'player.inventory.added',
        message: `You add ${ItemFormatter.formatProseItem(delta.item, delta.count)} to your pack.`,
        voice: this.silent ? Voice.mute : Voice.gamemaster,
        item: delta.item,
        count: delta.count
      });
    }
  }
}
