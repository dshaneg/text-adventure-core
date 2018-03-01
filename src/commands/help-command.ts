'use strict';

import { Command } from './command';
import { EventPublisher } from '../domain/event-publisher';
import { Voice } from '../domain/voice';
import { ReadOnlyGameState } from '../state/game-state';
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

  execute(gameState: ReadOnlyGameState, publisher: EventPublisher): void {
    publisher.publish({
      topic: 'game.help-requested',
      message: this.gameDefinitionRepository.getGameDefinition().help,
      voice: Voice.gamemaster
    });
  }
}
