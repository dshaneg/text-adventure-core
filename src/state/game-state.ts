'use strict';

import { MapNode } from '../domain/map-node';
import { GameMap } from '../domain/game-map';
import { Player, createRealityNode } from './player';
import { EdgeState } from './player-map-node';

export class GameState {
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

  tryMove(direction: string): boolean {
    const currentNode = this.player.currentNode;
    const successor = currentNode.getSuccessor(direction);

    if (successor) {
      this.player.currentNode = successor;
      return true;
    }

    return false;
  }

  teleport(targetNode: MapNode) {
    if (!targetNode) {
      throw new Error('Can\'t teleport to a nonexistent node!');
    }

    this.player.currentNode = targetNode;
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

  queryCurrentNode() {
    return this.player.currentNode;
  }

  queryAvailableDirections(gameMap: GameMap): Array<EdgeState> {
    return this.player.getPlayerMapNode(this.player.currentNode).getAvailableDirections(this, gameMap);
  }
}
