'use strict';

import { MapNode } from './map-node';
import { GameMap } from './game-map';
import { GameState } from './game-state';

const directionValues = new Map([
  ['n', 0],
  ['s', 1],
  ['e', 2],
  ['w', 3],
  ['u', 4],
  ['d', 5]
]);

export type EdgeState = { direction: string, visited: number, traversed: boolean };

export class PlayerMapNode {
  constructor(nodeId: number) {
    this.id = nodeId;
    this.visited = 0;
  }

  public id: number;
  public visited: number;

  visit() {
    this.visited += 1;
  }

  getAvailableDirections(gameState: GameState, gameMap: GameMap) {
    const directions: Array<EdgeState> = [];

    const mapNode = gameMap.get(this.id);

    for (const edge of mapNode.edges) {
      const discoveredSet = new Set([this.id]);
      const visited = gameState.player.visited(edge.headNode);
      directions.push({ direction: edge.direction, visited: visited, traversed: this.checkTraversed(gameState, gameMap, discoveredSet) });
    }

    return directions.sort(directionCompare);
  }

  private checkTraversed(gameState: GameState, gameMap: GameMap, discoveredSet: Set<number>) {
    // be careful: this is not an acyclic graph
    if (!this.visited) {
      return false;
    }

    discoveredSet.add(this.id);

    const mapNode = gameMap.get(this.id);
    for (const edge of mapNode.edges) {
      // todo: eventually need to simplify into another map structure that combines the static values from gamemap with the dynamic ones of gamestate.player
      if (!discoveredSet.has(edge.headNode.id)) {
        const playerMapNode = gameState.player.getPlayerMapNode(mapNode);
        if (!playerMapNode || !playerMapNode.checkTraversed(gameState, gameMap, discoveredSet)) {
          return false;
        }
      }
    }

    return true;
  }
}

function directionCompare(a: EdgeState, b: EdgeState) {
  return directionValues.get(a.direction) - directionValues.get(b.direction);
}

