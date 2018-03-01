import { MapNodeRepository } from './map-node-repository';
import { GameState } from './state/game-state';
import { StateChangeHandler } from './domain/state-change-handler/state-change-handler';

import { GameStartedHandler } from './domain/state-change-handler/game-started-handler';
import { GameStoppedHandler } from './domain/state-change-handler/game-stopped-handler';
import { PlayerInventoryAddedHandler } from './domain/state-change-handler/player-inventory-added-handler';
import { PlayerInventoryEquippedHandler } from './domain/state-change-handler/player-inventory-equipped-handler';
import { PlayerLocationMovedHandler } from './domain/state-change-handler/player-location-moved-handler';
import { GameStateEventSubscriber } from './domain/game-state-event-subscriber';

export class GameStateEventSubscriberFactory {
  constructor(private mapNodeRepository: MapNodeRepository) {
    this.playerLocationMovedHandler = new PlayerLocationMovedHandler(this.mapNodeRepository);
    this.playerInventoryAddedHandler = new PlayerInventoryAddedHandler();
    this.playerInventoryEquippedHandler = new PlayerInventoryEquippedHandler();
    this.gameStartedHandler = new GameStartedHandler();
    this.gameStoppedHandler = new GameStoppedHandler();
  }

  private playerLocationMovedHandler: StateChangeHandler;
  private playerInventoryAddedHandler: StateChangeHandler;
  private playerInventoryEquippedHandler: StateChangeHandler;
  private gameStartedHandler: StateChangeHandler;
  private gameStoppedHandler: StateChangeHandler;

  create(gameState: GameState): GameStateEventSubscriber {
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