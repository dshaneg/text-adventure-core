'use strict';

import { CommandFactory } from './commands/command-factory';

// command parsers
import { MoveParser } from './parsers/move-parser';
import { ListInventoryParser } from './parsers/list-inventory-parser';
import { ExitParser } from './parsers/exit-parser';
import { HelpParser } from './parsers/help-parser';

// dev-mode (cheat) command parsers
import { TeleportParser } from './parsers/teleport-parser';
import { ConjureItemParser } from './parsers/conjure-item-parser';

import { GameState } from './game-state';
import { Parser } from './parsers/parser';

// game command handlers
export class GameEngine {
  constructor(commandFactory: CommandFactory, debugMode: boolean = false) {
    this.parser = new MoveParser(commandFactory);
    const chainTail = this.parser
      .setNext(new ListInventoryParser(commandFactory))
      .setNext(new ExitParser(commandFactory))
      .setNext(new HelpParser(commandFactory));

    if (debugMode) {
      chainTail
        .setNext(new TeleportParser(commandFactory))
        .setNext(new ConjureItemParser(commandFactory));
    }
  }

  parser: Parser;

  handleInput(gameState: GameState, inputText: string): any {
    const command = this.parser.parse(inputText);

    if (command) {
      command.execute(gameState);

      // return list of events from gamestate's new flushevents method
    }
    else {
      // return bad parse error message
    }
  }
}
