'use strict';

// lots of overloading of the term "map" in this class
// creating a map (dictionary) that contains nodes from the game layout map

import { MapNode } from './map-node';

export class GameMap {
  constructor(
    private nodeMap: Map<number, MapNode>,
    entryNodeId: number) {
    this._entryNode = this.nodeMap.get(entryNodeId);
  }


  private _entryNode: MapNode;
  get entryNode(): MapNode { return this._entryNode; }

  get(nodeId: number) {
    return this.nodeMap.get(nodeId);
  }
}


