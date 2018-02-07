'use strict';

import { MapNode } from './map-node';
import { Inventory } from './inventory';
import { PlayerMapNode } from './player-map-node';

export class Player {
  constructor(currentNode: MapNode) {
    this.inventory = new Inventory();
    this._playerMapNodes = new Map<number, PlayerMapNode>();

    this.currentNode = currentNode;
  }

  public inventory: Inventory;

  private _currentNode: MapNode;

  private _playerMapNodes: Map<number, PlayerMapNode>;

  visited(node: MapNode): number {
    const playerNode = this._playerMapNodes.get(node.id);
    return playerNode && playerNode.visited;
  }

  getPlayerMapNode(mapNode: MapNode) {
    return this._playerMapNodes.get(mapNode.id);
  }

  get currentNode() {
    return this._currentNode;
  }

  set currentNode(node) {
    this._currentNode = node;

    let playerMapNode = this._playerMapNodes.get(node.id);

    if (!playerMapNode) {
      playerMapNode = new PlayerMapNode(node.id);
      this._playerMapNodes.set(node.id, playerMapNode);
    }

    playerMapNode.visit();
  }
}