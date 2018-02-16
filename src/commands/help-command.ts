'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../state/game-state';
import { GameDefinitionRepository, GameDefinition } from '../game-definition-repository';

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
      message: this.gameDefinitionRepository.getGameDefinition().help,
      voice: Voice.gamemaster
    });
  }
}
