'use strict';

import { Command, AddEventCall } from './command';
import { GameState } from '../game-state';
import { CommandFactory } from './command-factory';

import { ItemRepository } from '../item-repository';

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class ConjureItemCommand implements Command {

  constructor(commandFactory: CommandFactory, itemRepository: ItemRepository, itemId: number, count: number) {
    this.commandFactory = commandFactory;
    this.itemRepository = itemRepository;

    this.itemId = itemId;
    this.count = count;
  }

  private commandFactory: CommandFactory;
  private itemRepository: ItemRepository;

  private itemId: number;
  private count: number;

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const item = this.itemRepository.get(this.itemId);
    const count = this.count || 1;

    if (!item) {
      addEvent( { topic: 'error', message: `Could not conjure item ${this.itemId}. No such item exists.` });
    }

    // in the future, I want to conjure items to a map location as well
    addEvent({
      topic: 'item.conjured',
      message: 'The air begins to crackle with energy and suddenly something materializes in your hands...',
      item,
      count,
      target: 'inventory'
    });

    this.commandFactory.createAddInventoryCommand([{ item, count }]).execute(gameState, addEvent);
  }
}
