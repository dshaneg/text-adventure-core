'use strict';

import { Parser } from './parser';
import { TeleportCommand } from '../commands/teleport-command';
import { commandChannel as channel } from '../message-bus';
import { GameState } from '../game-state';

const verbSynonyms = ['teleport', 'port', 'portal'];

/**
 * Note: Developer Command a.k.a. cheat
 * Parses the input text and decides whether to return a teleport command.
 * The teleport keyword should be followed by the id of the node you want to teleport to.
 *
 * @class TeleportParser
 */
export class TeleportParser extends Parser {
  parseInput(gameState: GameState, inputText: string): { channel: any, command: TeleportCommand } {
    const words = inputText.toLowerCase().match(/\b(\w+)\b/g);

    if (words && words.length === 2 && verbSynonyms.indexOf(words[0]) !== -1) {
      const nodeId = Number(words[1]);

      return { channel, command: new TeleportCommand(gameState, nodeId) };
    }

    return null;
  }
}
