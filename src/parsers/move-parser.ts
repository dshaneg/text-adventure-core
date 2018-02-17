'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { MoveCommand } from '../commands/move-command';
import { GameState } from '../state/game-state';

const verbSynonyms = ['move', 'go', 'travel', 'walk', 'run', 'shamble', 'shuffle'];
const directionSynonyms = ['n', 's', 'e', 'w', 'u', 'd', 'north', 'south', 'east', 'west', 'up', 'down', 'dn'];

export class MoveParser extends Parser {
  constructor(private commandFactory: CommandFactory) { super(); }

  parseInput(inputText: string): MoveCommand {
    if (!inputText) {
      return null;
    }

    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 1 && directionSynonyms.indexOf(words[0]) !== -1) {
      return this.commandFactory.createMoveCommand(words[0].charAt(0));
    }

    if (words && words.length >= 2 && verbSynonyms.indexOf(words[0]) !== -1 &&
      directionSynonyms.indexOf(words[1]) !== -1) {
      return this.commandFactory.createMoveCommand(words[1].charAt(0));
    }

    return null;
  }
}
