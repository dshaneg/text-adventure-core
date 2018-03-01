'use strict';

import { MapNode } from '../domain/map-node';
import { GameMap } from '../domain/game-map';
import { Player, createRealityNode } from './player';
import { EdgeState } from './player-map-node';

export interface ReadOnlyGameState {
  readonly isStarted: boolean;
  readonly sessionToken: string;

  queryCurrentNode(): MapNode;
  querySuccessorNode(direction: string): MapNode;
  queryAvailableDirections(gameMap: GameMap): Array<EdgeState>;

  queryInventory(): any[];
  queryEquippedItems(): any[];
}

export class GameState implements ReadOnlyGameState {
  constructor(sessionToken: string) {
    this.player = new Player(createRealityNode());
    this._started = false;
    this._sessionToken = sessionToken;
  }

  public get isStarted(): boolean {
    return this._started;
  }

  private _started: boolean;
  private _sessionToken: string;

  public player: Player;

  public get sessionToken(): string {
    return this._sessionToken;
  }

  start() {
    this._started = true;
  }

  stop() {
    this._started = false;
  }

  setCurrentLocation(targetNode: MapNode) {
    if (!targetNode) {
      throw new Error('Can\'t set location to a nonexistent node!');
    }

    this.player.currentNode = targetNode;
  }

  querySuccessorNode(direction: string): MapNode {
    const currentNode = this.player.currentNode;
    const successor = currentNode.getSuccessor(direction);

    return successor;
  }
    queryCurrentNode() {
    return this.player.currentNode;
  }

  queryAvailableDirections(gameMap: GameMap): Array<EdgeState> {
    return this.player.getPlayerMapNode(this.player.currentNode).getAvailableDirections(this, gameMap);
  }

  addInventory(item: any, count: number = 1) {
    this.player.inventory.add(item, count);
  }

  equip(item: any) {
    this.player.inventory.equip(item);
  }

  queryInventory() {
    return this.player.inventory.getAll();
  }

  queryEquippedItems() {
    return this.player.inventory.getEquipped();
  }
}
