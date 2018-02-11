'use strict';

import { GameState } from './game-state';
import { Parser } from './parsers/parser';
import { AddEventCall } from './commands/command';
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

  stopGame(gameState: GameState): any {
    return this.handleInput(gameState, 'force stop game');
  }

  getAvailableDirections(gameState: GameState): Array<any> {
    return gameState.queryAvailableDirections(this._mapNodeRepository.gameMap);
  }

  handleInput(gameState: GameState, inputText: string): any {
    const eventQueue = new Array<any>();
    // couldn't pass eventQueue.push as the function to command.execute--v8 throws an error
    const addEvent: AddEventCall = (event: any): void => { eventQueue.push(event); };

    const command = this._parser.parse(inputText);

    if (command) {
      command.execute(gameState, addEvent);
    }
    else {
      addEvent({
        topic: 'parser.failed',
        message: 'I didn\'t understand that. Type <<help>> if you\'re stuck.'
      });
    }

    return { command: inputText, events: eventQueue };

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
