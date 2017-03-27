'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { TeleportCommand, TeleportData } from '../commands/teleport-command';
import { GameState } from '../game-state';
import { GameMap } from '../game-map';

export class TeleportHandler extends CommandHandler {
  constructor(map: GameMap) {
    super();
    this.gameMap = map;
  }

  private gameMap: GameMap;

  subscribeToTopic() {
    commandChannel.subscribe(TeleportCommand.topic, (data: TeleportData) => this.handle(data));
  }

  handle(data: TeleportData) {
    try {
      const targetNode = this.gameMap.get(data.targetNodeId);

      if (!targetNode) {
        eventChannel.publish({
          topic: 'error',
          data: `Could not teleport. No node with id ${data.targetNodeId}.`
        });

        return;
      }

      data.gameState.player.currentNode = targetNode;

      eventChannel.publish({
        topic: 'player.location.teleported',
        data: { previousNode: data.gameState.player.currentNode, currentNode: targetNode }
      });
    } catch (error) {
      eventChannel.publish({ topic: 'error', data: error });
    }
  }
}

