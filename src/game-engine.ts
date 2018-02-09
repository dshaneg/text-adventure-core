'use strict';

import { CommandFactory } from './commands/command-factory';

import { GameState } from './game-state';
import { Parser } from './parsers/parser';

// game command handlers
export class GameEngine {
  constructor(parser: Parser) {
    this.parser = parser;
  }

  parser: Parser;

  startGame(gameState: GameState): any {
    return this.handleInput(gameState, 'start game');
  }

  handleInput(gameState: GameState, inputText: string): any {
    const command = this.parser.parse(inputText);

    if (command) {
      command.execute(gameState);

      // return list of events from gamestate's new flushevents method
      return gameState;
    }
    else {
      // return bad parse error message
    }
  }
}
