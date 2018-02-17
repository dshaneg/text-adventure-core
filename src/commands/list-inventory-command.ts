'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { GameState } from '../state/game-state';
import { ItemFormatter } from './item-formatter';

/**
 * Class representing a command instructing the game to provide the contents of the player's inventory.
 */
export class ListInventoryCommand implements Command {

  execute(gameState: GameState, publisher: EventPublisher): void {
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

    publisher.publish({
      topic: 'player.inventory.list-requested',
      message,
      voice: Voice.gamemaster,
      items
    });
  }
}
