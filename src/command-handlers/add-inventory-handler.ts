'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { AddInventoryCommand, AddInventoryData } from '../commands/add-inventory-command';
import { GameState } from '../game-state';

export class AddInventoryHandler extends CommandHandler {
  subscribeToTopic() {
    commandChannel.subscribe(AddInventoryCommand.topic, (data: AddInventoryData) => this.handle(data));
  }

  handle(data: AddInventoryData) {
    try {
      for (const delta of data.deltas) {
        data.gameState.player.inventory.add(delta.item, delta.count);
      }

      eventChannel.publish({ topic: 'player.inventory.added', data });
    } catch (error) {
      eventChannel.publish({ topic: 'error', data: error });
    }
  }
}

