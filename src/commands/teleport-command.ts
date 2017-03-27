'use strict';

import { Command } from './command';
import { GameState } from '../game-state';

const topic = 'player.location.teleport';

export type TeleportData = {
  gameState: GameState,
  targetNodeId: number
};

/**
 * Class representing a command to send a player to a node that is not necessarily adjacent to the current node.
 */
export class TeleportCommand implements Command {

  /**
   * Create an instance of StartCommand.
   */
  constructor(gameState: GameState, targetNodeId: number) {
    this.topic = topic;
    this.data = { gameState, targetNodeId };
  }

  public topic: string;
  public data: TeleportData;

  static get topic() {
    return topic;
  }
}

