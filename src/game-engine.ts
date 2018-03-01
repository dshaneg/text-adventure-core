'use strict';

import { GameState } from './state/game-state';
import { Voice } from './domain/voice';
import { Parser } from './parsers/parser';
import { MapNodeRepository } from './map-node-repository';
import { QueueingEventSubscriber } from './domain/queueing-event-subscriber';
import { GameStateEventSubscriber } from './domain/game-state-event-subscriber';
import { Publisher } from './domain/event-publisher';

import { GameStartedHandler } from './domain/state-change-handler/game-started-handler';
import { GameStoppedHandler } from './domain/state-change-handler/game-stopped-handler';
import { PlayerInventoryAddedHandler } from './domain/state-change-handler/player-inventory-added-handler';
import { PlayerInventoryEquippedHandler } from './domain/state-change-handler/player-inventory-equipped-handler';
import { PlayerLocationMovedHandler } from './domain/state-change-handler/player-location-moved-handler';

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
    // todo: need a factory for the publisher that still allows me to get at the queued events...
    // this subscriber queues events for the current command then those events are returned at the end of the function
    const queueingSubscriber = new QueueingEventSubscriber();
    // this subscriber updates the gamestate each time an event is published. Giving event sourcing a try, but have to only let the events drive changes to the state
    const stateSubscriber = this.createStateSubscriber(gameState);
    const publisher = new Publisher([queueingSubscriber, stateSubscriber]);

    const command = this.parser.parse(inputText);

    if (command) {
      command.execute(gameState, publisher);
    }
    else {
      publisher.publish({
        topic: 'parser.failed',
        message: 'Huh? I didn\'t understand that. Type <<help>> if you\'re stuck.',
        voice: Voice.gamemaster
      });
    }

    return { command: inputText, session: gameState.sessionToken, events: queueingSubscriber.events };
  }

  private createStateSubscriber(gameState: GameState) {
    const handlers = [
      new PlayerLocationMovedHandler(this.mapNodeRepository),
      new PlayerInventoryAddedHandler(),
      new PlayerInventoryEquippedHandler(),
      new GameStartedHandler(),
      new GameStoppedHandler()
    ];

    return new GameStateEventSubscriber(gameState, handlers);
  }
}
