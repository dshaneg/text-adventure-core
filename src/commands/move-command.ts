'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ReadOnlyGameState } from '../state/game-state';
import { DirectionIndex } from '../domain/direction-index';

/**
 * Class representing a command instructing the game conjure an item from the nether.
 */
export class MoveCommand implements Command {

  /**
   * Creates an instance of ConjureItemCommand.
   *
   * @param {String} direction - n|s|e|w|u|d
   *
   * @memberOf ConjureItemCommand
   */
  constructor(private direction: string) {
  }

  execute(gameState: ReadOnlyGameState, publisher: EventPublisher): void {
    const previousNode = gameState.queryCurrentNode();

    const targetNode = gameState.querySuccessorNode(this.direction);

    const directionName = DirectionIndex.getDirectionName(this.direction);

    if (targetNode) {
      publisher.publish({
        topic: 'player.location.moved',
        message: targetNode.description,
        voice: Voice.bard,
        previousNode: { id: previousNode.id, name: previousNode.name, location: previousNode.location },
        currentNode: { id: targetNode.id, name: targetNode.name, location: targetNode.location },
        direction: directionName
      });
    } else {
      publisher.publish({
        topic: 'player.location.move-blocked',
        message: `The way ${directionName} is not for you to travel.`,
        voice: Voice.gamemaster,
        currentNode: { id: previousNode.id, name: previousNode.name, location: previousNode.location },
        direction: directionName
      });
    }
  }
}
