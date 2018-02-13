'use strict';

import { Command, AddEventCall } from './command';
import { Voice } from '../voice';
import { GameState } from '../game-state';
import { GameMap } from '../game-map';

/**
 * Class representing a command to send a player to a node that is not necessarily adjacent to the current node.
 */
export class TeleportCommand implements Command {

  /**
   * Create an instance of StartCommand.
   */
  constructor(
    private map: GameMap,
    private targetNodeId: number,
    private silent: boolean = false) {
  }

  execute(gameState: GameState, addEvent: AddEventCall): void {
    const targetNode = this.map.get(this.targetNodeId);

    if (!targetNode) {
      addEvent({
        topic: 'error',
        message: `Could not teleport. No node with id ${this.targetNodeId}.`,
        voice: Voice.warden
      });
      return;
    }

    const previousNode = gameState.player.currentNode;
    gameState.player.currentNode = targetNode;

    addEvent({
      topic: 'player.location.teleporting',
      message: 'Your eyesight begins to swim and you feel a strong tug at the base of your stomach...',
      voice: this.silent ? Voice.mute : Voice.bard
    });

    addEvent({
      topic: 'player.location.moved',
      message: targetNode.description,
      voice: Voice.bard,
      previousNode: { id: previousNode.id, name: previousNode.name, location: previousNode.location },
      currentNode: { id: targetNode.id, name: targetNode.name, location: targetNode.location },
      direction: 'teleport'
    });
  }
}
