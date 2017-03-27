'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { ConjureItemCommand, ConjureItemData } from '../commands/conjure-item-command';
import { AddInventoryCommand, AddInventoryData } from '../commands/add-inventory-command';
import { ItemRepository } from '../item-repository';
import { GameState } from '../game-state';

export class ConjureItemHandler extends CommandHandler {
  constructor(itemRepository: ItemRepository) {
    super();
    this.itemRepository = itemRepository;
  }

  private itemRepository: ItemRepository;

  subscribeToTopic() {
    commandChannel.subscribe(ConjureItemCommand.topic, (data: ConjureItemData) => this.handle(data));
  }

  handle(data: ConjureItemData) {
    try {
      const item = this.itemRepository.get(data.itemId);
      const count = data.count || 1;

      if (!item) {
        eventChannel.publish({ topic: 'error', data: `Could not conjure item ${data.itemId}. No such item exists.` });
        return;
      }

      // in the future, I want to conjure items to a map location as well
      eventChannel.publish({ topic: 'item.conjured', data: { item, count, target: 'inventory' } });

      commandChannel.publish(new AddInventoryCommand(data.gameState, [{ item, count }]));
    } catch (error) {
      eventChannel.publish({ topic: 'error', data: error });
    }
  }
}

