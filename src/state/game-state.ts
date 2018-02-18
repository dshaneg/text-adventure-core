'use strict';

import { MapNode } from '../domain/map-node';
import { GameMap } from '../domain/game-map';
import { Player } from './player';
import { EdgeState } from './player-map-node';

export class GameState {
  constructor(sessionToken: string) {
    const currentNode = new MapNode({ id: -1, name: 'the real world', description: [''], location: { x: 0, y: 0, z: 0 } });

    this.player = new Player(currentNode);

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

  equip(item: any) {
    this.player.inventory.equip(item);
  }

  queryAvailableDirections(gameMap: GameMap): Array<EdgeState> {
    return this.player.getPlayerMapNode(this.player.currentNode).getAvailableDirections(this, gameMap);
  }

  addInventory(item: any, count: number) {
    this.player.inventory.add(item, count);
  }

  queryInventory() {
    return this.player.inventory.getAll();
  }

  queryCurrentNode() {
    return this.player.currentNode;
  }
}
