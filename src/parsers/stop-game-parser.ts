'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { StopGameCommand } from '../commands/stop-game-command';
import { GameState } from '../state/game-state';

const verbSynonyms = ['quit', 'q', 'exit', 'bye', 'leave'];

export class StopGameParser extends Parser {
  constructor(private commandFactory: CommandFactory) { super(); }

  parseInput(inputText: string): StopGameCommand {
    if (!inputText) {
      return null;
    }

    if (inputText === 'force stop game') {
      return this.commandFactory.createStopGameCommand(true);
    }

    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 1 && verbSynonyms.indexOf(words[0]) !== -1) {
      return this.commandFactory.createStopGameCommand(false);
    }

    return null;
  }
}
