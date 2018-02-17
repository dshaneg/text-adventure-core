'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { ListInventoryCommand } from '../commands/list-inventory-command';
import { GameState } from '../state/game-state';

const verbSynonyms = ['inventory', 'inv', 'i'];

export class ListInventoryParser extends Parser {
  constructor(private commandFactory: CommandFactory) { super(); }

  parseInput(inputText: string): ListInventoryCommand {
    if (!inputText) {
      return null;
    }

    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 1 && verbSynonyms.indexOf(words[0]) !== -1) {
      return this.commandFactory.createListInventoryCommand();
    }

    return null;
  }
}
