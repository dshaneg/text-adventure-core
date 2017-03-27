'use strict';

import { Parser } from './parser';
import { ListInventoryCommand } from '../commands/list-inventory-command';
import { commandChannel as channel } from '../message-bus';
import { GameState } from '../game-state';

const verbSynonyms = ['inventory', 'inv', 'i'];

export class ListInventoryParser extends Parser {
  parseInput(gameState: GameState, inputText: string): { channel: any, command: ListInventoryCommand } {
    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 1 && verbSynonyms.indexOf(words[0]) !== -1) {
      return { channel, command: new ListInventoryCommand(gameState) };
    }

    return null;
  }
}
