'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../game-state';
import { ItemFormatter } from '../item-formatter';

/**
 * Class representing a command instructing the game to provide the contents of the player's inventory.
 */
export class ListInventoryCommand implements Command {

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const items = gameState.queryInventory();

    let message: string;

    if (!items.length) {
      message = 'Inventory is empty.';
    } else {
      const lines: string[] = [];
      lines.push('You are carrying the following items:');
      for (const stack of items) {
        lines.push(ItemFormatter.formatListItem(stack.item, stack.count));
      }
      message = lines.join('\n');
    }

    addEvent({
      topic: 'player.inventory.list-requested',
      message,
      voice: Voice.gamemaster,
      items
    });
  }
}
