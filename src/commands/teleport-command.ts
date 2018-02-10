'use strict';

import { Command, AddEventCall } from './command';
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

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const targetNode = this.map.get(this.targetNodeId);

    if (!targetNode) {
      addEvent({
        topic: 'error',
        message: `Could not teleport. No node with id ${this.targetNodeId}.`
      });
      return;
    }

    const previousNode = gameState.player.currentNode;
    gameState.player.currentNode = targetNode;

    addEvent({
      topic: 'player.location.teleported',
      previousNode: { id: previousNode.id, name: previousNode.name, description: previousNode.description, location: previousNode.location },
      currentNode: { id: targetNode.id, name: targetNode.name, description: targetNode.description, location: targetNode.location }
    });
  }
}
