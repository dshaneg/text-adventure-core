'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.inventory.add';

export type AddInventoryData = {
  gameState: GameState,
  deltas: Array<{ item: any, count: number }>
};

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
  constructor(gameState: GameState, deltas: Array<{ item: any, count: number }>) {
    this.topic = topic;
    this.gameState = gameState;
    this.deltas = deltas;
  }

  public topic: string;
  private gameState: GameState;
  private deltas: Array<{ item: any, count: number }>;


  public get data(): AddInventoryData {
    return { gameState: this.gameState, deltas: this.deltas };
  }

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

  static get topic() {
    return topic;
  }
}
