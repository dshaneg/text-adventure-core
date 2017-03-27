'use strict';

import { Command } from '../commands/command';
import { GameState } from '../game-state';

export abstract class Parser {
  setNext(parser: Parser) {
    this.next = parser;
    return parser;
  }

  public next: Parser;

  parse(gameState: GameState, input: string): { channel: any, command: Command } {
    const command = this.parseInput(gameState, input);
    if (!command && this.next) {
      return this.next.parse(gameState, input);
    }

    return command;
  }

  abstract parseInput(gameState: GameState, input: string): { channel: any, command: Command };
}

