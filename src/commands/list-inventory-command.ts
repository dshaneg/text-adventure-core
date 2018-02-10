'use strict';

import { Command, AddEventCall } from './command';
import { GameState } from '../game-state';

/**
 * Class representing a command instructing the game to provide the contents of the player's inventory.
 */
export class ListInventoryCommand implements Command {

  constructor() {
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    gameState.queryInventory();
  }
}
