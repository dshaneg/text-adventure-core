'use strict';

import { EventSubscriber } from './event-subscriber';
import { GameState } from '../state/game-state';
import { GameMap } from '../domain/game-map';

export class GameStateEventSubscriber implements EventSubscriber {
  constructor(private map: GameMap, private gameState: GameState) {}

  handle(event: any): void {
    switch (event.topic) {
      case 'player.location.moved':
        this.gameState.setCurrentLocation(this.map.get(event.currentNode.id));
        break;
      case 'player.inventory.added':
        this.gameState.addInventory(event.item, event.count);
        break;
    }
  }
}
