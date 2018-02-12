'use strict';

import { Command, AddEventCall } from './command';
import { GameState } from '../game-state';

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
  constructor(direction: string) {
    this.direction = direction;
  }

  private direction: string;

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const previous = gameState.player.currentNode;

    const moved = gameState.tryMove(this.direction);

    const directionName = getDirectionName(this.direction);

    const current = gameState.player.currentNode;

    if (moved) {
      addEvent({
        topic: 'player.location.moved',
        previousNode: { id: previous.id, name: previous.name, description: previous.description, location: previous.location },
        currentNode: { id: current.id, name: current.name, description: current.description, location: current.location },
        direction: directionName
      });
    } else {
      addEvent({
        topic: 'player.location.move-blocked',
        currentNode: { id: current.id, name: current.name, description: current.description, location: current.location },
        message: `The way ${directionName} is not for you to travel.`,
        direction: directionName
      });
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
