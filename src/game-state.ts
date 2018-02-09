'use strict';

import { MapNode } from './map-node';
import { Player } from './player';

export class GameState {
  constructor(sessionToken: string) {
    const currentNode = new MapNode({ id: -1, name: 'the real world', description: [''], location: { x: 0, y: 0, z: 0 } });

    this.sessionToken = sessionToken;
    this.player = new Player(currentNode);
  }

  public get isStarted(): boolean {
    return this._started;
  }

  private _started: boolean;

  public player: Player;

  public sessionToken: string;

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

  queryInventory() {
    throw new Error('not implemented');
    // const inventoryList = data.gameState.player.inventory.getAll();

    // eventChannel.publish('player.inventory.list-requested', { items: inventoryList });
  }

  queryHelp() {
    throw new Error('not implemented');
    // eventChannel.publish('game.help-requested', {
    //   text: this.gameDefinitionRepository.gameDefinition.help
    // })
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
