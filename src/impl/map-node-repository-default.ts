'use strict';

// lots of overloading of the term "map" in this class
// creating a map (dictionary) that contains nodes from the game layout map

const mapDefinition = require('../../game/map');
import { MapNodeRepository } from '../map-node-repository';
import { GameMap } from '../domain/game-map';
import { MapNode } from '../domain/map-node';

export class MapNodeRepositoryDefault implements MapNodeRepository {

  private map: GameMap;

  getMap(): GameMap {
    if (!this.map) {
      this.map = this.createMap(mapDefinition);
    }

    return this.map;
  }

  private createMap(definition: any): GameMap {
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
}

