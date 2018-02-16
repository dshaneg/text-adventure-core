'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { StartGameCommand } from '../commands/start-game-command';
import { GameState } from '../state/game-state';

export class StartGameParser extends Parser {
  parseInput(inputText: string): StartGameCommand {
    if (inputText === 'start game') {
      return this.commandFactory.createStartGameCommand();
    }

    return null;
  }
}
