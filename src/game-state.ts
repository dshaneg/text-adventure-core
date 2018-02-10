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
    this._eventQueue = new Array<any>();
  }

  public get isStarted(): boolean {
    return this._started;
  }

  private _eventQueue: Array<any>;
  private _started: boolean;
  private _sessionToken: string;

  public player: Player;

  public addEvent(event: any) {
    this._eventQueue.push(event);
  }

  public get sessionToken(): string {
    return this._sessionToken;
  }

  public get events(): Array<any> {
    // I'd rather get a copy of the array, but this can slide for now.
    return this._eventQueue;
  }

  flushEvents() {
    this._eventQueue = new Array<any>();
  }

  start(gameDefinition: any) {
    this._started = true;

    this.addEvent({
      topic: 'game.started',
      banner: gameDefinition.banner,
      text: gameDefinition.opening
    });
  }

  stop(force: boolean) {
    if (force) {
      this._started = false;
      this.addEvent({ topic: 'game.stopped', sessionToken: this._sessionToken });
    } else {
      this.addEvent({ topic: 'game.stop-requested', sessionToken: this._sessionToken });
    }
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

    this.addEvent({ topic: 'player.inventory.item-equipped', item });
  }

  queryAvailableDirections(gameMap: GameMap): Array<EdgeState> {
    return this.player.getPlayerMapNode(this.player.currentNode).getAvailableDirections(this, gameMap);
  }

  addInventory(item: any, count: number) {
    this.player.inventory.add(item, count);

    this.addEvent({ topic: 'player.inventory.added', item, count });
  }

  queryInventory() {
    throw new Error('not implemented');
    // const inventoryList = data.gameState.player.inventory.getAll();

    // eventChannel.publish('player.inventory.list-requested', { items: inventoryList });
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
