'use strict';

import { Command } from '../commands/command';
import { CommandFactory } from '../commands/command-factory';
import { GameState } from '../game-state';

export abstract class Parser {
  constructor(commandFactory: CommandFactory) {
    this.commandFactory = commandFactory;
  }

  protected commandFactory: CommandFactory;

  setNext(parser: Parser) {
    this.next = parser;
    return parser;
  }

  public next: Parser;

  parse(input: string): Command {
    const command = this.parseInput(input);
    if (!command && this.next) {
      return this.next.parse(input);
    }

    return command;
  }

  abstract parseInput(input: string): Command;
}

