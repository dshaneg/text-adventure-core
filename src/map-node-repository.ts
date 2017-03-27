'use strict';

// lots of overloading of the term "map" in this class
// creating a map (dictionary) that contains nodes from the game layout map

const mapDefinition = require('../game/map');
import { MapNode } from './map-node';
import { GameMap } from './game-map';

export class MapNodeRepository {

  private map: GameMap;

  get gameMap() {
    if (!this.map) {
      this.map = createMap(mapDefinition);
    }

    return this.map;
  }

  // get entryNode() {
  //   return this.nodeMap.get(mapDefinition.start);
  // }

  // get(nodeId: number) {
  //   return this.nodeMap.get(nodeId);
  // }
}

function createMap(definition: any) {
  const map = new Map();
  // private map: Map<number, MapNode>;

  for (const node of definition.nodes) {
    map.set(node.id, new MapNode(node));
  }

  for (const arrow of definition.arrows) {
    const tailNode = map.get(arrow.tail);
    const headNode = map.get(arrow.head);

    tailNode.addEdge({ headNode, direction: arrow.direction });
  }

  return new GameMap(map, mapDefinition.start);
}

