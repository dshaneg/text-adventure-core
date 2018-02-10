'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { ConjureItemCommand } from '../commands/conjure-item-command';
import { GameState } from '../game-state';

const verbSynonyms = ['conjureitem', 'conjure_item', 'ci'];

/**
 * Note: Developer Command a.k.a. cheat.
 * Parses the input text and decides whether to return a conjure item command.
 * The conjure keyword should be followed by the id of the item you want to conjure.
 *
 * @class ConjureItemParser
 */
export class ConjureItemParser extends Parser {
  constructor(commandFactory: CommandFactory) { super(commandFactory); }

  parseInput(inputText: string): ConjureItemCommand {
    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && (words.length === 2 || words.length === 3) && verbSynonyms.indexOf(words[0]) !== -1) {
      const itemId = Number(words[1]);
      let count = 1;
      if (words[2]) {
        count = Number(words[2]);
      }

      return this.commandFactory.createConjureItemHandlerCommand(itemId, count);
    }

    return null;
  }
}
