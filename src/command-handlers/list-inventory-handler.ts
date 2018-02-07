'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { GameState } from '../game-state';
import { ListInventoryCommand, ListInventoryData } from '../commands/list-inventory-command';

export class ListInventoryHandler extends CommandHandler {
  subscribeToTopic() {
    commandChannel.subscribe(ListInventoryCommand.topic, (data: { gameState: GameState }) => this.handle(data));
  }

  handle(data: ListInventoryData) {
    try {
      const inventoryList = data.gameState.player.inventory.getAll();

      eventChannel.publish('player.inventory.list-requested', { items: inventoryList });
    } catch (error) {
      eventChannel.publish('error', error);
    }
  }
}

