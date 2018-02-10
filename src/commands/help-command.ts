'use strict';

import { Command, AddEventCall } from './command';
import { GameState } from '../game-state';
import { GameDefinitionRepository } from '../game-definition-repository';

/**
 * Class representing a command instructing the provide help text.
 */
export class HelpCommand implements Command {
  /**
   * Create an instance of HelpCommand.
   */
  constructor(private gameDefinitionRepository: GameDefinitionRepository) {
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    addEvent({
      topic: 'game.help-requested',
      message: this.gameDefinitionRepository.gameDefinition.help
    });
  }
}
