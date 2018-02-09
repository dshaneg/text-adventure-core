'use strict';

import { CommandFactory } from './commands/command-factory';

import { GameState } from './game-state';
import { Parser } from './parsers/parser';
import { MapNodeRepository } from './map-node-repository';

// game command handlers
export class GameEngine {
  constructor(parser: Parser, mapNodeRepository: MapNodeRepository) {
    this._parser = parser;
    this._mapNodeRepository = mapNodeRepository;
  }

  private _parser: Parser;
  private _mapNodeRepository: MapNodeRepository;

  startGame(gameState: GameState): any {
    return this.handleInput(gameState, 'start game');
  }

  handleInput(gameState: GameState, inputText: string): any {
    const command = this._parser.parse(inputText);

    if (command) {
      command.execute(gameState);

      const availableDirections = gameState.queryAvailableDirections(this._mapNodeRepository.gameMap);
      // return list of events from gamestate's new flushevents method
      return {
        locName: gameState.player.currentNode.name,
        locDescription: gameState.player.currentNode.description,
        moves: availableDirections
      };
    }
    else {
      // return bad parse error message
    }
  }
}
