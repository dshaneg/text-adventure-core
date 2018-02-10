'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { StopGameCommand } from '../commands/stop-game-command';
import { GameState } from '../game-state';

const verbSynonyms = ['quit', 'q', 'exit', 'bye', 'leave'];

export class StopGameParser extends Parser {
  parseInput(inputText: string): StopGameCommand {
    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (inputText === 'force stop game') {
      return this.commandFactory.createStopGameCommand(true);
    }

    if (words && words.length === 1 && verbSynonyms.indexOf(words[0]) !== -1) {
      return this.commandFactory.createStopGameCommand(false);
    }

    return null;
  }
}
