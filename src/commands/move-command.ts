'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../state/game-state';

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

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const previous = gameState.player.currentNode;

    const moved = gameState.tryMove(this.direction);

    const directionName = getDirectionName(this.direction);

    const current = gameState.player.currentNode;

    if (moved) {
      addEvent({
        topic: 'player.location.moved',
        message: current.description,
        voice: Voice.bard,
        previousNode: { id: previous.id, name: previous.name, location: previous.location },
        currentNode: { id: current.id, name: current.name, location: current.location },
        direction: directionName
      });
    } else {
      addEvent({
        topic: 'player.location.move-blocked',
        message: `The way ${directionName} is not for you to travel.`,
        voice: Voice.gamemaster,
        currentNode: { id: current.id, name: current.name, location: current.location },
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
