'use strict';

import { Command } from './command';
import { GameState } from '../game-state';
import { GameMap } from '../game-map';

/**
 * Class representing a command to send a player to a node that is not necessarily adjacent to the current node.
 */
export class TeleportCommand implements Command {

  /**
   * Create an instance of StartCommand.
   */
  constructor(map: GameMap, targetNodeId: number) {
    this.map = map;
    this.targetNodeId = targetNodeId;
  }

  private map: GameMap;
  private targetNodeId: number;

  execute(gameState: GameState): void {
    const targetNode = this.map.get(this.targetNodeId);

    if (!targetNode) {
      throw new Error(`Could not teleport. No node with id ${this.targetNodeId}.`);
    }

    gameState.player.currentNode = targetNode;
  }
}

