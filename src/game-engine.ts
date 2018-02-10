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
    let message;

    if (command) {
      command.execute(gameState);
    }
    else {
      // this feels hacky. In the wrong place.
      gameState.addEvent({
        topic: 'parser.failed',
        text: 'I didn\'t understand that.'
      });
    }

    const events = gameState.events;
    gameState.flushEvents();
    return { command: inputText, events };

    // const availableDirections = gameState.queryAvailableDirections(this._mapNodeRepository.gameMap);
    // return list of events from gamestate's new flushevents method
    // const currentNode = gameState.player.currentNode;

    // return {
    //   command: inputText,
    //   locName: currentNode.name,
    //   locDescription: currentNode.description,
    //   locVisited: gameState.player.visited(currentNode),
    //   events: events,
    //   moves: availableDirections
    // };
  }
}
