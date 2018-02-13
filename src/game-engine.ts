'use strict';

import { GameState } from './game-state';
import { Voice } from './voice';
import { Parser } from './parsers/parser';
import { AddEventCall } from './commands/command';
import { MapNodeRepository } from './map-node-repository';

// game command handlers
export class GameEngine {
  constructor(
    private parser: Parser,
    private mapNodeRepository: MapNodeRepository) {
  }

  startGame(gameState: GameState): any {
    return this.handleInput(gameState, 'start game');
  }

  stopGame(gameState: GameState): any {
    return this.handleInput(gameState, 'force stop game');
  }

  getAvailableDirections(gameState: GameState): Array<any> {
    return gameState.queryAvailableDirections(this.mapNodeRepository.gameMap);
  }

  handleInput(gameState: GameState, inputText: string): any {
    const eventQueue = new Array<any>();
    // couldn't pass eventQueue.push as the function to command.execute--v8 throws an error
    const addEvent: AddEventCall = (event: any): void => { eventQueue.push(event); };

    const command = this.parser.parse(inputText);

    if (command) {
      command.execute(gameState, addEvent);
    }
    else {
      addEvent({
        topic: 'parser.failed',
        message: 'Huh? I didn\'t understand that. Type <<help>> if you\'re stuck.',
        voice: Voice.gamemaster
      });
    }

    return { command: inputText, events: eventQueue };
  }
}
