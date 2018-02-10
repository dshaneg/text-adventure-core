'use strict';

import { MapNode } from './map-node';
import { Player } from './player';
import { GameMap } from './game-map';
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

  tryMove(direction: string) {
    const currentNode = this.player.currentNode;
    const successor = currentNode.getSuccessor(direction);

    const directionName = getDirectionName(direction);

    if (successor) {
      this.player.currentNode = successor;
    // } else {
    //   eventChannel.publish(
    //     'player.location.move-blocked',
    //     { currentNode, direction: directionName }
    //   );
    }
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
}

function getDirectionName(abbreviation: string) {
  switch (abbreviation) {
    case 'n':
      return 'north';
    case 's':
      return 'south';
    case 'e':
      return 'east';
    case 'w':
      return 'west';
    case 'u':
      return 'up';
    case 'd':
      return 'down';
    default:
      return 'unknown';
  }
}
