'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../game-state';
import { CommandFactory } from './command-factory';

import { ItemRepository } from '../item-repository';

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class ConjureItemCommand implements Command {

  constructor(
    private commandFactory: CommandFactory,
    private itemRepository: ItemRepository,
    private itemId: number,
    private count: number) {
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const item = this.itemRepository.get(this.itemId);
    const count = this.count || 1;

    if (!item) {
      addEvent( {
        topic: 'error',
        message: `Could not conjure item ${this.itemId}. No such item exists.`,
        voice: Voice.warden
      });

      return;
    }

    // in the future, I want to conjure items to a map location as well
    addEvent({
      topic: 'item.conjured',
      message: 'The air begins to crackle with energy and suddenly something materializes in your hands...',
      voice: Voice.bard,
      item,
      count,
      target: 'inventory'
    });

    this.commandFactory.createAddInventoryCommand([{ item, count }]).execute(gameState, addEvent);
  }
}
