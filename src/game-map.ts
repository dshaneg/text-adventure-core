'use strict';

// lots of overloading of the term "map" in this class
// creating a map (dictionary) that contains nodes from the game layout map

const mapDefinition = require('../game/map');
import { MapNode } from './map-node';

export class GameMap {

  private nodeMap: Map<number, MapNode>;

  private _entryNode: MapNode;
  get entryNode(): MapNode { return this._entryNode; }

  constructor(nodeMap: Map<number, MapNode>, entryNodeId: number) {
    this.nodeMap = nodeMap;
    this._entryNode = this.nodeMap.get(entryNodeId);
  }

  get(nodeId: number) {
    return this.nodeMap.get(nodeId);
  }
}


