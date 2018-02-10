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
    gameState.tryMove(this.direction);
  }
}
