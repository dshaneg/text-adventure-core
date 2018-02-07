'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { EquipItemCommand, EquipItemData } from '../commands/equip-item-command';
import { GameState } from '../game-state';

export class EquipItemHandler extends CommandHandler {
  subscribeToTopic() {
    commandChannel.subscribe(EquipItemCommand.topic, (data: EquipItemData) => this.handle(data));
  }

  handle(data: EquipItemData) {
    try {
      data.gameState.player.inventory.equip(data.item);

      eventChannel.publish('player.inventory.item-equipped', data);
    } catch (error) {
      eventChannel.publish('error', error);
    }
  }
}

