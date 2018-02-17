'use strict';

import { Parser } from './parser';
import { CommandFactory } from '../commands/command-factory';
import { TeleportCommand } from '../commands/teleport-command';
import { GameState } from '../state/game-state';

const verbSynonyms = ['teleport', 'port', 'portal'];

/**
 * Note: Developer Command a.k.a. cheat
 * Parses the input text and decides whether to return a teleport command.
 * The teleport keyword should be followed by the id of the node you want to teleport to.
 *
 * @class TeleportParser
 */
export class TeleportParser extends Parser {
  constructor(private commandFactory: CommandFactory) { super(); }

  parseInput(inputText: string): TeleportCommand {
    if (!inputText) {
      return null;
    }

    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 2 && verbSynonyms.indexOf(words[0]) !== -1) {
      const nodeId = Number(words[1]);

      return this.commandFactory.createTeleportCommand(nodeId);
    }

    return null;
  }
}
