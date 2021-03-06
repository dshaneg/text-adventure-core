'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { GameState } from '../state/game-state';
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

  execute(gameState: GameState, publisher: EventPublisher): void {
    const previous = gameState.queryCurrentNode();

    const moved = gameState.tryMove(this.direction);

    const directionName = DirectionIndex.getDirectionName(this.direction);

    const current = gameState.queryCurrentNode();

    if (moved) {
      publisher.publish({
        topic: 'player.location.moved',
        message: current.description,
        voice: Voice.bard,
        previousNode: { id: previous.id, name: previous.name, location: previous.location },
        currentNode: { id: current.id, name: current.name, location: current.location },
        direction: directionName
      });
    } else {
      publisher.publish({
        topic: 'player.location.move-blocked',
        message: `The way ${directionName} is not for you to travel.`,
        voice: Voice.gamemaster,
        currentNode: { id: current.id, name: current.name, location: current.location },
        direction: directionName
      });
    }
  }
}
