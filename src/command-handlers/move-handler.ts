'use strict';

import { CommandHandler } from './command-handler';
import { commandChannel, eventChannel } from '../message-bus';
import { MoveCommand, MoveData } from '../commands/move-command';
import { GameState } from '../game-state';

export class MoveHandler extends CommandHandler {
  subscribeToTopic() {
    commandChannel.subscribe(MoveCommand.topic, (data: MoveData) => this.handle(data));
  }

  handle(data: MoveData) {
    try {
      const currentNode = data.gameState.player.currentNode;
      const successor = currentNode.getSuccessor(data.direction);

      const directionName = getDirectionName(data.direction);

      if (successor) {
        data.gameState.player.currentNode = successor;

        eventChannel.publish({
          topic: 'player.location.moved',
          data: { previousNode: currentNode, currentNode: successor, direction: directionName }
        });
      } else {
        eventChannel.publish({
          topic: 'player.location.move-blocked',
          data: { currentNode, direction: directionName }
        });
      }
    } catch (error) {
      eventChannel.publish({ topic: 'error', data: error });
    }
  }
}

function getDirectionName(abbreviation: string) {
  switch (abbreviation) {
    case 'n':
      return 'north';
    case 's':
      return 'south';
    case 'e':
      return 'east';
    case 'w':
      return 'west';
    case 'u':
      return 'up';
    case 'd':
      return 'down';
    default:
      return 'unknown';
  }
}

