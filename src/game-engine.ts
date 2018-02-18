'use strict';

import { GameState } from './state/game-state';
import { Voice } from './domain/voice';
import { Parser } from './parsers/parser';
import { MapNodeRepository } from './map-node-repository';
import { EventQueue } from './event-queue';

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
    return gameState.queryAvailableDirections(this.mapNodeRepository.getMap());
  }

  handleInput(gameState: GameState, inputText: string) {
    const eventQueue = new EventQueue();

    const command = this.parser.parse(inputText);

    if (command) {
      command.execute(gameState, eventQueue);
    }
    else {
      eventQueue.publish({
        topic: 'parser.failed',
        message: 'Huh? I didn\'t understand that. Type <<help>> if you\'re stuck.',
        voice: Voice.gamemaster
      });
    }

    return { command: inputText, session: gameState.sessionToken, events: eventQueue.events };
  }
}
