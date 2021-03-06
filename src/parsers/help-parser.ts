'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { HelpCommand } from '../commands/help-command';
import { GameState } from '../state/game-state';

const verbSynonyms = ['help', 'h'];

export class HelpParser extends Parser {
  constructor(private commandFactory: CommandFactory) { super(); }

  parseInput(inputText: string): HelpCommand {
    if (!inputText) {
      return null;
    }

    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 1 && verbSynonyms.indexOf(words[0]) !== -1) {
      return this.commandFactory.createHelpCommand();
    }

    return null;
  }
}
